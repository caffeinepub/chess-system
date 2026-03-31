import Time "mo:core/Time";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";

actor {
  type Player = {
    #anonymous;
    #named : {
      name : Text;
      level : Nat;
      xp : Nat;
      rank : ChessRank;
      skills : Skills;
    };
  };

  module Player {
    public func compare(player1 : Player, player2 : Player) : Order.Order {
      func getPlayerName(player : Player) : Text {
        switch (player) {
          case (#anonymous) { "Anonymous" };
          case (#named { name }) { name };
        };
      };
      Text.compare(getPlayerName(player1), getPlayerName(player2));
    };
  };

  type Skills = {
    calculation : Nat;
    patternRecognition : Nat;
    endgameTechnique : Nat;
    openingKnowledge : Nat;
    timeManagement : Nat;
  };

  type ChessRank = {
    #E;
    #D;
    #C;
    #B;
    #A;
    #S;
    #National;
    #Monarch;
    #Absolute;
  };

  type DailyQuest = {
    id : Nat;
    title : Text;
    description : Text;
    category : QuestCategory;
    xpReward : Nat;
    difficulty : QuestDifficulty;
    isCompleted : Bool;
    dateAssigned : Int;
  };

  type QuestCategory = {
    #tactics;
    #endgame;
    #opening;
    #positional;
    #blitz;
  };

  type QuestDifficulty = {
    #easy;
    #medium;
    #hard;
    #legendary;
  };

  let players = Map.singleton<Text, Player>("default", #anonymous);
  var nextPlayerId = 0;

  public shared ({ caller }) func createPlayer(name : Text) : async Text {
    nextPlayerId += 1;
    let playerId = "p" # nextPlayerId.toText();
    if (players.containsKey(playerId)) {
      Runtime.trap("This player ID already exists.");
    };
    let newPlayer : Player = #named({
      name;
      level = 1;
      xp = 0;
      rank = #E;
      skills = {
        calculation = 1;
        patternRecognition = 1;
        endgameTechnique = 1;
        openingKnowledge = 1;
        timeManagement = 1;
      };
    });
    players.add(playerId, newPlayer);
    playerId;
  };

  public query ({ caller }) func getPlayer(playerId : Text) : async Player {
    switch (players.get(playerId)) {
      case (null) { Runtime.trap("Player does not exist") };
      case (?player) { player };
    };
  };

  public query ({ caller }) func getAllPlayers() : async [Player] {
    players.values().toArray().sort();
  };
};
