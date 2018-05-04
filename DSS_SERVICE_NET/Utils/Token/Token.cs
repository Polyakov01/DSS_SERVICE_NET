using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcApplication1.classes
{
    public class Token
    {
        public int use_code { get; set; }
        public string token { get; set; }
        public DateTime tokenExpire { get; set; }

        public Token(int _use_code, string _token, DateTime _tokenExpire)
        {
            use_code = _use_code;
            token = _token;
            tokenExpire = _tokenExpire;
        }        
    }
}