import { user, caregiver } from '../models';
import { JWTSecrete } from './Password';
import { languageTranslation } from '../helpers';
const jwt = require('jsonwebtoken');
import en from '../language/en.json';
import { validateAttribute } from './ValidateAttribute';

/**
 * Verified Login Token
 *
 * @author Gunjali
 * @param  req
 * @return object
 */
/* export const ValidateAdminToken = (req) => {
    const token = req.headers['authorization'] ? req.headers['authorization'].toString() : '';
    try {
      const tokenData = jwt.verify(token, JWTSecrete);
      return tokenData;
    } catch (error) {
      return null
    }
  }; */

export const ValidateAdminToken = async (req) => {
  const token = req.headers['authorization']
    ? req.headers['authorization'].toString()
    : '';
  try {
    const tokenData = jwt.verify(token, JWTSecrete);
    if (tokenData && tokenData.userRole === 'caregiver') {
      let loginPossible = await validateAttribute(
        'LP',
        caregiver,
        tokenData.id
      );
      if (!loginPossible) {
        throw new Error(en.loginNotPossible);
      } else {
        return tokenData;
      }
    } else {
      return tokenData;
    }
  } catch (error) {
    return null;
  }
};

/**
 * Admin Login Token
 *
 * @author Gunjali
 * @param  tokenData
 * @param  lang
 * @return object
 */
export const shouldAdminLogin = async (tokenData, lang = 'de') => {
  if (!tokenData || !tokenData.id) {
    throw new Error(languageTranslation(lang, 'sessionExpire'));
  }
  const currentUser = await user.findOne({
    where: {
      id: tokenData.id,
      // userRole: 'admin'
    },
  });
  if (!currentUser) {
    throw new Error(languageTranslation(lang, 'invaliAuthToken'));
  }
  return currentUser;
};

/**
 * Caregiver Login Token
 *
 * @author Gunjali
 * @param  tokenData
 * @param  lang
 * @return object
 */
export const shouldCaregiverLogin = async (tokenData, lang = 'de') => {
  if (!tokenData || !tokenData.id) {
    throw new Error(languageTranslation(lang, 'sessionExpire'));
  }
  const currentUser = await user.findOne({
    where: {
      id: tokenData.id,
      userRole: 'caregiver',
    },
    include: {
      model: caregiver,
    },
  });

  if (!currentUser) {
    throw new Error(languageTranslation(lang, 'invaliAuthToken'));
  }
  return currentUser;
};

/**
 * Verified Language Token
 *
 * @author Gunjali
 * @param  req
 * @return languagetokenData
 */
export const ValidateLanguageToken = (req) => {
  const languageToken = req.headers['language']
    ? req.headers['language'].toString()
    : '';
  try {
    let languagetokenData = '';
    if (languageToken) {
      languagetokenData = jwt.verify(languageToken, JWTSecrete);
      return languagetokenData.language;
    }
  } catch (error) {
    return languagetokenData.de;
  }
};

/**
 * Generate language Token
 *
 * @author Gunjali
 * @return true
 */
export const generateLanguageToken = () => {
  //Generate English token
  const enToken = jwt.sign(
    {
      language: 'en',
    },
    JWTSecrete
  );
  //Generate German Token
  const deToken = jwt.sign(
    {
      language: 'de',
    },
    JWTSecrete
  );
  return true;
};
