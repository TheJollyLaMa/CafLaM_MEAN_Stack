pragma solidity >=0.4.21 <0.7.0;
import "./AngelToken.sol";

contract AT_X is AngelToken {
  uint256 public last_rnd_id = 0;
  uint256 ca_num_to_issue;
  string ca_mint_date;
  uint256 ca_cost;
  uint256 ca_angel_coefficient;
  uint256 ca_status;
  string ca_product;
  uint256 la_num_to_issue;
  string la_mint_date;
  uint256 la_cost;
  uint256 la_angel_coefficient;
  uint256 la_status;
  string la_product;
  uint256 _total_angels_share;
  mapping(uint256 => mapping(address => uint256)) public map_angel_to_payout;

  constructor()
   AngelToken()
    public {}

  function crowdfund_execution(address payable _owner, uint256 _id) public returns(bool executed){
    // require(balanceOf(_owner, _id) == 0, "Err: not all tokens of that series are sold yet!");
    //fetch the current alm and change its status
    Alms.Alm memory cur_alm = map_id_to_Alm[_id];
    (ca_num_to_issue, ca_mint_date, ca_cost, ca_angel_coefficient, ca_status, ca_product) = abi.decode(cur_alm.mint_data,(uint256, string, uint256, uint256, uint256, string));
    //change status on tokens to 'executed' & reencode
    cur_alm.mint_data = abi.encode(ca_num_to_issue, ca_mint_date, ca_cost, ca_angel_coefficient, 2, ca_product);
    map_id_to_Alm[_id] = cur_alm;
    if(last_rnd_id != 0){
      //fetch the last alm to get payout details
      Alms.Alm memory last_alm = map_id_to_Alm[last_rnd_id];
      (la_num_to_issue, la_mint_date, la_cost, la_angel_coefficient, la_status, la_product) = abi.decode(last_alm.mint_data,(uint256, string, uint256, uint256, uint256, string));
      //payout mapping
      _total_angels_share = (la_cost * la_num_to_issue) - 5500;// subtract estimated expenses & overhead to import, produce, and ship product
      for(uint256 i=1; i<=Angel_List.length; i++) {
        address payable angel = Angel_List[i];
        uint256 angels_bal = balanceOf(angel, last_rnd_id);
        uint256 payout_amt = _total_angels_share / (angels_bal * la_angel_coefficient);
        map_angel_to_payout[_id][angel] = payout_amt;
        angel.transfer(payout_amt);
        /* has to be done in web3 */
        // has to be on layer 2 and payouts have to accumulate to overcome transaction costs
        // maybe angels could choose to keep their rewards in a yield pool and earn income on it until its value appreciates over gross costs
      }
      //Roaster Share
      map_angel_to_payout[_id][_owner] = _total_angels_share / (la_num_to_issue * la_angel_coefficient);
      _owner.transfer(_total_angels_share / (la_num_to_issue * la_angel_coefficient));
      //change status on tokens to 'PAID' & reencode
      last_alm.mint_data = abi.encode(la_num_to_issue, la_mint_date, la_cost, la_angel_coefficient, 4, la_product);
      map_id_to_Alm[last_rnd_id] = last_alm;
    }else{
      //seed round
      uint256 payout1 = ((ca_num_to_issue * ca_cost) - 5500);
      map_angel_to_payout[_id][_owner] = payout1;
      //one transfer for seed round, can be done on layer 1
      // _owner.transfer(payout1);
      last_rnd_id = _id;
    }
    executed = true;
    return executed;
  }

  function change_status_s(uint256 _id) public{
    /* fetch the current alm */
    Alms.Alm memory alm =  map_id_to_Alm[_id];
    require(msg.sender == alm.owner, "Err: Must own token to change status");
      uint256 alm_num_to_issue;
       string memory alm_mint_date;
        uint256 alm_cost;
         uint256 alm_angel_coefficient;
          uint256 alm_status;
           string memory alm_product;
    (alm_num_to_issue, alm_mint_date, alm_cost, alm_angel_coefficient, alm_status, alm_product) = abi.decode(alm.mint_data,(uint256, string, uint256, uint256, uint256, string));
    /* change status on tokens to 'executed' & reencode */
    alm.mint_data = abi.encode(alm_num_to_issue, alm_mint_date, alm_cost, alm_angel_coefficient, 3, alm_product);
    map_id_to_Alm[_id] = alm;
  }

}
