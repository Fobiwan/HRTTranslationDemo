const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');


/**
 * Helper 
 * @param {*} errorMessage 
 * @param {*} defaultLanguage 
 */
function getTheErrorResponse(errorMessage, defaultLanguage) {
  return {
    statusCode: 200,
    body: {
      language: defaultLanguage || 'en',
      errorMessage: errorMessage
    }
  };
}

/**
  *
  * main() will be run when the action is invoked
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
function main(params) {
  /*
   * The default language to choose in case of an error
   */
  const defaultLanguage = 'en';
  var bestLanguage;
  var confidence;

  return new Promise(function (resolve, reject) {

    try {
      
      // *******TODO**********
      // - Call the language identification API of the translation service
      // see: https://cloud.ibm.com/apidocs/language-translator?code=node#identify-language
      // - if successful, resolve exactly like shown below with the
      // language that is most probable the best one in the "language" property
      // and the confidence it got detected in the "confidence" property

      // in case of errors during the call resolve with an error message according to the pattern 
      // found in the catch clause below
      const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
      const { IamAuthenticator } = require('ibm-watson/auth');

      const languageTranslator = new LanguageTranslatorV3({
        version: '2020-11-19',
        authenticator: new IamAuthenticator({
          apikey: 'm-QirLnBImNUjgparLCOo2U88-Rvg8ya32idHqjVf4i-',
        }),
        serviceUrl: 'https://api.eu-de.language-translator.watson.cloud.ibm.com/instances/6f5707d3-22ff-448f-a042-7f5bc19d87a8',
      });

      const identifyParams = {
        text: params.text
      };

      console.log("hallo hier: " + identifyParams.text);
      languageTranslator.identify(identifyParams)
        .then(identifiedLanguages => {
              //console.log(JSON.stringify(identifiedLanguages, null, 2));
              bestLanguage = identifiedLanguages.result.languages[0].language;
              confidence = identifiedLanguages.result.languages[0].confidence;
              resolve({
                statusCode: 200,
                body: {
                  text: identifyParams.text, 
                  language: bestLanguage,
                  confidence: confidence,
                },
                headers: { 'Content-Type': 'application/json' }
              });
        })
        .catch(err => {
          console.log('error:', err);
        });



    } catch (err) {
      console.error('Error while initializing the AI service detect', err);
      resolve(getTheErrorResponse('Error while communicating with the language service detect', defaultLanguage));
    }

  });
}
