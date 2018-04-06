var web3 = require('web3');
var solc = require('solc');
var fs = require('fs');
var config = require('./config');

// setup blockchain
function init() {
    let compiledCode;
    if (fs.existsSync('contracts/vote.solc')) {
        compiledCode = JSON.parse(fs.readFileSync('contracts/vote.solc'));
    } else {
        let code = fs.readFileSync('contracts/vote.sol').toString();
        compiledCode = solc.compile(code);

        fs.writeFileSync('contracts/vote.solc', JSON.stringify(compiledCode));
    }

    config.web3provider = new web3(new web3.providers.HttpProvider("http://localhost:8545"));
    config.abiDefinition = JSON.parse(compiledCode.contracts[':Election'].interface);
    config.byteCode = compiledCode.contracts[':Election'].bytecode;

    config.web3provider.eth.getAccounts((err, res) => {
        config.defaultAccount = res[0];

        config.mainContract = new config.web3provider.eth.Contract(
            config.abiDefinition,
            config.defaultAccount);
        config.mainContract.deploy({
            data: config.byteCode,
            arguments: [[web3.utils.asciiToHex('Donald Trump'),
                web3.utils.asciiToHex('Hillary Clinton')]]
        }).send({
            from: config.defaultAccount,
            gas: 1500000,
            gasPrice: '30000000000000'
        })
            .then(function(newContractInstance){
                config.mainContractInstance = newContractInstance;
            });
    });
}

module.exports = {
    init: init
};