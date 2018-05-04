using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcApplication1.classes
{
    public class TokenManager
    {
        private static List<Token> tokenList = new List<Token>();

        public static bool getTokenActive(int use_code)
        {
            //tokenList.Add(new Token(
            if (tokenList.Find(x => x.use_code == use_code) != null)
            {
                if (tokenList.Find(x => x.use_code == use_code).tokenExpire > DateTime.Now)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }

        public static string setTokenLogin(int use_code)
        {
            Token fToken = tokenList.Find(x => x.use_code == use_code);
            if (fToken == null)
            {
                return addToken(use_code);
            }
            else
            {
                if (fToken.tokenExpire < DateTime.Now)
                {
                    tokenList.Remove(fToken);
                    return addToken(use_code);
                }
                else
                {
                    tokenList.Find(x => x.use_code == use_code).tokenExpire = DateTime.Now.AddMinutes(double.Parse(System.Configuration.ConfigurationManager.AppSettings["TokenExpiredTime"]));
                    return fToken.token;
                }
            }
        }

        private static void setTokenRenewOnly(int use_code)
        {
            tokenList.Find(x => x.use_code == use_code).tokenExpire = DateTime.Now.AddMinutes(double.Parse(System.Configuration.ConfigurationManager.AppSettings["TokenExpiredTime"]));
        }

        public static string getTokenString(int use_code)
        {
            return tokenList.Find(x => x.use_code == use_code).token;
        }

        public static bool checkToken(string token)
        {
            Token fToken = tokenList.Find(x => x.token == token);
            if (fToken != null && fToken.tokenExpire> DateTime.Now)
            {
                setTokenRenewOnly(fToken.use_code);
                return true;
            }
            else
            {
                return false;
            }
        }

        public static bool checkToken(string token, out int use_code)
        {
            Token fToken = tokenList.Find(x => x.token == token);
            if (fToken != null && fToken.tokenExpire > DateTime.Now)
            {
                use_code = tokenList.Find(x => x.token == token).use_code;
                setTokenRenewOnly(fToken.use_code);
                return true;
            }
            else
            {
                use_code = 0;
                throw new Exception("token expired expired time:"+fToken.tokenExpire+"server time: "+DateTime.Now.ToString());
               // return false;
            }

        }

        public static string addToken(int use_code)
        {
            String salt = "(Nic!odY X<2E+{-_COBI+e95/^ a![EQh|);Z|V{lYR*_]e)=T%*e;G/f;ZlJjH')";
            string accessToken = "";
            if (tokenList.Find(x => x.use_code == use_code) == null)
            {
                accessToken = SHA1Util.SHA1HashStringForUTF8String(use_code.ToString() + DateTime.Now.ToString("YYYY-MM-dd_HH-mm-ss") + salt);
                tokenList.Add(new Token(use_code, accessToken, DateTime.Now.AddMinutes(double.Parse(System.Configuration.ConfigurationManager.AppSettings["TokenExpiredTime"]))));
            }
            return accessToken;
        }

    }
}