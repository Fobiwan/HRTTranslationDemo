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
  * main() will be run when teh action is invoked
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
  var translation;
  var word_count;
  var character_count;

  return new Promise(function (resolve, reject) {

    try {

      // *******TODO**********
      // - Call the language translation API of the translation service
      // see: https://cloud.ibm.com/apidocs/language-translator?code=node#translate
      // - if successful, resolve exatly like shown below with the
      // translated text in the "translation" property,
      // the number of translated words in "words"
      // and the number of characters in "characters".

      // in case of errors during the call resolve with an error message according to the pattern
      // found in the catch clause below

      // pick the language with the highest confidence, and send it back

      const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
      const { IamAuthenticator } = require('ibm-watson/auth');

      const languageTranslator = new LanguageTranslatorV3({
        version: '2020-11-19',
        authenticator: new IamAuthenticator({
          apikey: 'm-QirLnBImNUjgparLCOo2U88-Rvg8ya32idHqjVf4i-',
        }),
        serviceUrl: 'https://api.eu-de.language-translator.watson.cloud.ibm.com/instances/6f5707d3-22ff-448f-a042-7f5bc19d87a8',
      });

      console.log("text")
      const translateParams = {
        text: params.body.text,
        modelId: params.body.language+"-en",
      };

      console.log("TEXT HIER: " +params.body.text);
      languageTranslator.translate(translateParams)
        .then(translationResult => {
          //console.log(JSON.stringify(translationResult, null, 2));
          translation = translationResult.result.translations[0].translation;
          word_count = translationResult.result.word_count;
          character_count =  translationResult.result.character_count;

          resolve({
            statusCode: 200,
            body: {
              translations: translation,
              words: word_count,
              characters: character_count,
            },
            headers: { 'Content-Type': 'application/json' }
          });
        })
          .catch(err => {
          console.log('error:', err);
        });

         
    } catch (err) {
      console.error('Error while initializing the AI service', err);
      resolve(getTheErrorResponse('Error while communicating with the language service', defaultLanguage));
    }
  });
}
