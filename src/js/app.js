App = {
    web3Provider: null,
    contracts: {},

    init: function() {
        return App.initWeb3();
    },

    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(App.web3Provider);
        } else {
            App.web3Provider = new Web3.providers.HttpProvider("http://localhost:3006")
            web3 = new Web3(App.web3Provider);
        }

        return App.initContract();
    },

    initContract: function() {

        $.getJSON('XYtoken.json', function(data) {
            var XYtokenArtifact = data;
            App.contracts.XYtoken = TruffleContract(XYtokenArtifact);

            App.contracts.XYtoken.setProvider(App.web3Provider);

            return App.getBalances();
        });

        return App.bindEvents();

    },

    bindEvents: function() {
        $(document).on('click', '#transferButton', App.handleTransfer);
    },


    handleTransfer: function(event) {
        event.preventDefault();

        var amount = parseInt($('#amount').val());
        var toAddress = $('#address').val();

        console.log('Transfer ' + amount + ' XY to ' + toAddress);

        var tutorialTokenInstance;

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.XYtoken.deployed().then(function(instance) {
                tutorialTokenInstance = instance;

                return tutorialTokenInstance.transfer(toAddress, amount, { from: account, gas: 100000 });
            }).then(function(result) {
                alert('Transfer Successful!');
                return App.getBalances();
            }).catch(function(err) {
                console.log(err.message);
            });
        });
    },

    getBalances: function() {
        console.log('Getting balances...');

        var tutorialTokenInstance;

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.XYtoken.deployed().then(function(instance) {
                tutorialTokenInstance = instance;

                return tutorialTokenInstance.balances(account);
            }).then(function(result) {
                balance = result;

                $('#XYBalance').text(balance);
            }).catch(function(err) {
                console.log(err.message);
            });
        });
    }
}



$(function() {
    $(window).load(function() {
        App.init();
    });
});