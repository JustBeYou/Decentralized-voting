pragma solidity ^0.4.0;

contract Election {
    mapping (bytes32 => uint64) public receivedVotes;
    bytes32[] public candidatesList;

    function Election(bytes32[] candidatesName) public {
        candidatesList = candidatesName;
    }

    function GetTotalVotesOf(bytes32 candidate) public view returns (uint64) {
        require(IsValidCandidate(candidate));
        return receivedVotes[candidate];
    }

    function VoteForCandidate(bytes32 candidate) public {
        require(IsValidCandidate(candidate));

        receivedVotes[candidate] += 1;
    }

    function IsValidCandidate(bytes32 candidate) public view returns (bool) {
        for (uint i = 0; i < candidatesList.length; i++) {
            if (candidatesList[i] == candidate) return true;
        }

        return false;
    }
}
