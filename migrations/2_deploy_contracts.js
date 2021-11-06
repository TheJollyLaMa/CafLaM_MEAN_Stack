const AngelToken = artifacts.require("AngelToken");
const AT_X = artifacts.require("AT_X");

module.exports = function(deployer, network, accounts) {
  // console.log(accounts);
  var date = new Date("01/01/2021").toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const original_alm = {
    endeavor_name: "Original Angel",
    endeavor_symbol : "OA",
    issue_num : 1000,
    mint_date : date,
    cost : 100,
    angel_coefficient : 0001,
    product : "1/2lb Shit from Healthy Bull"
  }
  const CafLaM_original_alm = {
    endeavor_name: "Caffeine LaManna Seed",
    endeavor_symbol : "CafLaM",
    issue_num : 1000,
    mint_date : date,
    cost : 10,
    angel_coefficient : 0005,
    product : "1/2lb whole bean roasted coffee"
  }
  const CafLaM_alm1 = {
    endeavor_name: "Caffeine LaManna 1",
    endeavor_symbol : "CafLaM",
    issue_num : 1000,
    mint_date : date,
    cost : 10,
    angel_coefficient : 0005,
    product : "1/2lb whole bean roasted coffee"
  }
  const CafLaM_alm2 = {
    endeavor_name: "Caffeine LaManna 2",
    endeavor_symbol : "CafLaM",
    issue_num : 1000,
    mint_date : date,
    cost : 1,
    angel_coefficient : 0005,
    product : "1/2lb whole bean roasted coffee"
  }
  try{
    deployer.deploy(AngelToken).then(async function(){
      var at = await AngelToken.deployed();
      at.tokenGenesis(
       original_alm.endeavor_name,
        original_alm.endeavor_symbol,
         original_alm.issue_num,
          String(original_alm.mint_date),
           original_alm.cost,
            original_alm.angel_coefficient,
             original_alm.product
      );
      at.tokenGenesis(
        CafLaM_original_alm.endeavor_name,
         CafLaM_original_alm.endeavor_symbol,
          CafLaM_original_alm.issue_num,
           String(CafLaM_original_alm.mint_date),
            CafLaM_original_alm.cost,
             CafLaM_original_alm.angel_coefficient,
              CafLaM_original_alm.product
      );
      at.tokenGenesis(
        CafLaM_alm1.endeavor_name,
         CafLaM_alm1.endeavor_symbol,
          CafLaM_alm1.issue_num,
           String(CafLaM_alm1.mint_date),
            CafLaM_alm1.cost,
             CafLaM_alm1.angel_coefficient,
              CafLaM_alm1.product
      );
      at.tokenGenesis(
        CafLaM_alm2.endeavor_name,
         CafLaM_alm2.endeavor_symbol,
          CafLaM_alm2.issue_num,
           String(CafLaM_alm2.mint_date),
            CafLaM_alm2.cost,
             CafLaM_alm2.angel_coefficient,
              CafLaM_alm2.product
      );
    });
    deployer.deploy(AT_X);

  }catch(err){console.log(err);}

};
