pragma solidity >=0.4.21 <0.7.0;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import '@openzeppelin/contracts/access/Ownable.sol';
import "./Alm.sol";

contract AngelToken is ERC1155, Ownable{
  /* State variables are stored in the blockchain */
  mapping(uint256 => bool) public is_on_manifest;
  mapping (address => uint256) public map_owner_to_id;
  mapping (uint256 => Alms.Alm) public map_id_to_Alm;

  address payable public OA = msg.sender;
  mapping(uint256 => mapping(address => uint256)) public Angel_Map;
  address payable [] public Angel_List;

  Alms.Alm[] public alms;
  event ManifestedAngelToken(
     address owner,
      bytes _uri,
       string _ename,
        string _esym,
         uint256 _id,
          bytes mint_data
           );

  constructor()
    ERC1155("http://localhost:3000/public/#!/treasure_chest/{id}.json")
      Ownable()
          public {
          }

   function tokenGenesis (string memory _ename,string memory _esym,uint256 _num_to_issue,
         string memory _mint_date,uint256 _cost,uint256 _angel_coefficient,string memory _product)
      public payable {
          OA.transfer(msg.value);
          uint256 idmod = 10 ** 16;
          uint256 token_id = uint256(keccak256(abi.encodePacked(_ename)));
          uint256 _id = token_id % idmod;
          require(!is_on_manifest[_id], "Err: Pick a Unique Endeavor Name");
          is_on_manifest[_id] = true;
          Alms.Alm memory new_alm;
          new_alm.owner = msg.sender;
          new_alm.name = _ename;
          new_alm.sym = _esym;
          new_alm.id = _id;
          bytes memory new_uri = abi.encode(_esym, "/", _id, ".json");
          new_alm.uri = new_uri;
          bytes memory mintData = abi.encode(_num_to_issue, _mint_date, _cost, _angel_coefficient, 1, _product);
          new_alm.mint_data = mintData;
          alms.push(new_alm);
          map_owner_to_id[msg.sender] = _id;
          map_id_to_Alm[_id] = new_alm;
          _mint(msg.sender, _id, _num_to_issue, mintData);
          emit ManifestedAngelToken(new_alm.owner,new_alm.uri,new_alm.name,new_alm.sym,new_alm.id,new_alm.mint_data);
  }
  function getAlmsLength() public view returns(uint256){
    return alms.length;
  }
  function buyAlms(address payable _owner, uint256 _id, uint256 _amount, uint256 _cost, bytes memory _data) public payable returns(address){
      require(msg.value >= (_cost * _amount), "Err: not enough eth sent, No Soup For You!");
      require(balanceOf(_owner, _id) >= _amount, "Err: not enough tokens to fill your order!");
      // uint256 OA_share = msg.value - (_amount/1000);
      // _owner.transfer(msg.value - OA_share);
      OA.transfer(msg.value);
      safeTransferFrom(_owner, msg.sender, _id, _amount, _data);
      Angel_Map[_id][msg.sender] += _amount;
      Angel_List.push(msg.sender);
      return msg.sender;
  }
}
