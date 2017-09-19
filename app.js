// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');
var Store = require('./store');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen to messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
    //appId: 'c9d1b29d-38b9-4192-9506-90a8a4eb9470',
    //appPassword: 'L1CTe53TWgs36LQBEDefpuK'	
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, [
    function (session) {
        // create the card based on selection
        //var selectedCardName = 2;//results.response.entity;
        var card = createThumbnailCard(session);//createCard(selectedCardName, session);

        // attach the card to the reply message
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
    }

    /*function (session) {
        builder.Prompts.choice(session, 'What card would like to test?', CardNames, {
            maxRetries: 3,
            retryPrompt: 'Ooops, what you wrote is not a valid option, please try again'
        });
    },
    function (session, results) {

        // create the card based on selection
        var selectedCardName = results.response.entity;
        var card = createCard(selectedCardName, session);

        // attach the card to the reply message
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
    }*/
]);

var HeroCardName = 'Hero card';
var ThumbnailCardName = 'Thumbnail card';
var ReceiptCardName = 'Receipt card';
var SigninCardName = 'Sign-in card';
var AnimationCardName = "Animation card";
var VideoCardName = "Video card";
var AudioCardName = "Audio card";
var CardNames = [HeroCardName, ThumbnailCardName, ReceiptCardName, SigninCardName, AnimationCardName, VideoCardName, AudioCardName];

function createCard(selectedCardName, session) {
    switch (selectedCardName) {
        case HeroCardName:
            return createHeroCard(session);
        case ThumbnailCardName:
            return createThumbnailCard(session);
        case ReceiptCardName:
            return createReceiptCard(session);
        case SigninCardName:
            return createSigninCard(session);
        case AnimationCardName:
            return createAnimationCard(session);
        case VideoCardName:
            return createVideoCard(session);
        case AudioCardName:
            return createAudioCard(session);
        default:
            return createHeroCard(session);
    }
}

function createHeroCard(session) {
    return new builder.HeroCard(session)
        .title('CSM Chatbot')
        .subtitle('I can answer questions as below.\nPlease click them.')
        .text('--------------------------------------------------')
        .images([
            builder.CardImage.create(session, 'http://www.gulfnet.co.jp/images/product_csm_01.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Know Features'),
            builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Know Cases'),
			builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Know Costs'),
			builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Know Operating Environments'),
			builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Know System Coorporation'),
			builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Shown Me a Demo'),
			builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Send Me Materials'),
            builder.CardAction.dialogAction(session, "weather", "Seattle, WA", "Current Weather")		
        ]);		
}

function createThumbnailCard(session) {
    return new builder.ThumbnailCard(session)
        .title('CSM Chatbot')
        .subtitle('I can answer questions as below.\nPlease click them.')
        .text('-----------------------------------------------------')
        .images([
            builder.CardImage.create(session, 'https://www.atpress.ne.jp/releases/115522/logo_org.jpg')
        ])
        .buttons([
            builder.CardAction.dialogAction(session, "CSMFeatures", "https://blog.botframework.com/", "Know features"),
            builder.CardAction.openUrl(session, 'http://www.gulfnet.co.jp/jirei.html', 'Know Cases'),
			builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Know Costs'),
			builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Know Operating Environments'),
			builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Know System Coorporation'),
			builder.CardAction.dialogAction(session, "DemoVideo", "https://blog.botframework.com/", 'Show Me a Demo'),
			builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Send Me Materials'),
			builder.CardAction.dialogAction(session, "ContactUs", "https://blog.botframework.com/", "Contact us")
        ]);
}

bot.beginDialogAction('CSMFeatures', '/News');
bot.beginDialogAction('DemoVideo', '/ShowVideo');
bot.beginDialogAction('ContactUs', '/SendEmail')

// Create the dialog itself.
bot.dialog('/News', [
    function (session, args) {
        //session.endDialog("Loading news from: " + args.data);
		        // Async search
        Store
            .searchHotels('CSM')
            .then(function (feature) {
                // args
                session.send('There are %d features in CSM:', feature.length);

                var message = new builder.Message()
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(feature.map(hotelAsAttachment));

                session.send(message);

                // End
                session.endDialog();
            });
    }
]);

bot.dialog('/ShowVideo', [
	function (session, args) {

				var card = createVideoCard(session);
				var message = new builder.Message().addAttachment(card);
                session.send(message);
                session.endDialog();
            //});		
    }
]);	

bot.dialog('/SendEmail', [ 
    function(session){
	builder.Prompts.text(session,'Please provide your email ID');	
	},	
	function (session, args) {
			//// send email ////
		    var emailID = args.response;
			console.log('Your email ID is ' + emailID);
			var nodemailer = require('nodemailer');
			var transporter = nodemailer.createTransport({
			     service: 'gmail',
			     //host: 'smtp.gmail.com',
				 //port: 465,
				 //secure: true, // use SSL 
			  auth: {
				user: 'nanhe.gupta@gmail.com',
				pass: 'kamakhya@Maa'
			  }
			});

			var mailOptions = {
			  from: 'nanhe.gupta@gmail.com',
			  to: 'ngupta@gulfnet.co.jp',
			  subject: 'Sending Email using CSM ChatBot',
			  text: 'Test email! \n Please contact: ' + emailID
			};

			transporter.sendMail(mailOptions, function(error, info){
			  if (error) {
				console.log(error);
			  } else {
				console.log('Email sent: ' + info.response);
				builder.Prompts.text(session, 'Thank You! \n A sales representative will contact you within one business day.');
				session.endDialog();
			  }
			});				
			///////////////////	
	}
]);	
// Helpers
function hotelAsAttachment(hotel) {
    return new builder.HeroCard()
        .title(hotel.name)
        .subtitle('This is a review text')
        .images([new builder.CardImage().url(hotel.image)])
        .buttons([
            new builder.CardAction()
                .title('More details')
                .type('openUrl')
                .value('https://www.bing.com/search?q=hotels+in+' + encodeURIComponent(hotel.location))
        ]);
}

var order = 1234;
function createReceiptCard(session) {
    return new builder.ReceiptCard(session)
        .title('John Doe')
        .facts([
            builder.Fact.create(session, order++, 'Order Number'),
            builder.Fact.create(session, 'VISA 5555-****', 'Payment Method')
        ])
        .items([
            builder.ReceiptItem.create(session, '$ 38.45', 'Data Transfer')
                .quantity(368)
                .image(builder.CardImage.create(session, 'https://github.com/amido/azure-vector-icons/raw/master/renders/traffic-manager.png')),
            builder.ReceiptItem.create(session, '$ 45.00', 'App Service')
                .quantity(720)
                .image(builder.CardImage.create(session, 'https://github.com/amido/azure-vector-icons/raw/master/renders/cloud-service.png'))
        ])
        .tax('$ 7.50')
        .total('$ 90.95')
        .buttons([
            builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/pricing/', 'More Information')
                .image('https://raw.githubusercontent.com/amido/azure-vector-icons/master/renders/microsoft-azure.png')
        ]);
}

function createSigninCard(session) {
    return new builder.SigninCard(session)
        .text('BotFramework Sign-in Card')
        .button('Sign-in', 'https://login.microsoftonline.com');
}

function createAnimationCard(session) {
    return new builder.AnimationCard(session)
        .title('Microsoft Bot Framework')
        .subtitle('Animation Card')
        .image(builder.CardImage.create(session, 'https://docs.microsoft.com/en-us/bot-framework/media/how-it-works/architecture-resize.png'))
        .media([
            { url: 'http://i.giphy.com/Ki55RUbOV5njy.gif' }
        ]);
}

function createVideoCard(session) {
    return new builder.VideoCard(session)
        .title('GulfNet CSM')
        .subtitle('Demo Video')
        .text('')
        .image(builder.CardImage.create(session, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/220px-Big_buck_bunny_poster_big.jpg'))
        .media([
            { url: 'https://www.youtube.com/watch?v=mbo8_VHaBWw' }
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://reg34.smp.ne.jp/regist/is?SMPFORM=lirf-mcrbl-e090e0cde7baf27008853ff94758470e', 'Contact us')
        ]);
}

function createAudioCard(session) {
    return new builder.AudioCard(session)
        .title('I am your father')
        .subtitle('Star Wars: Episode V - The Empire Strikes Back')
        .text('The Empire Strikes Back (also known as Star Wars: Episode V – The Empire Strikes Back) is a 1980 American epic space opera film directed by Irvin Kershner. Leigh Brackett and Lawrence Kasdan wrote the screenplay, with George Lucas writing the film\'s story and serving as executive producer. The second installment in the original Star Wars trilogy, it was produced by Gary Kurtz for Lucasfilm Ltd. and stars Mark Hamill, Harrison Ford, Carrie Fisher, Billy Dee Williams, Anthony Daniels, David Prowse, Kenny Baker, Peter Mayhew and Frank Oz.')
        .image(builder.CardImage.create(session, 'https://upload.wikimedia.org/wikipedia/en/3/3c/SW_-_Empire_Strikes_Back.jpg'))
        .media([
            { url: 'http://www.wavlist.com/movies/004/father.wav' }
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://en.wikipedia.org/wiki/The_Empire_Strikes_Back', 'Read More')
        ]);
}
