using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcApplication1
{
    public class DSS_RESPONSE
    {
        public string status { get; set; }
        public dynamic data { get; set; }
        private const string OK_MESSAGE = "OK";
        private const string ERROR_MESSAGE = "ERROR";
        
        public DSS_RESPONSE(bool IS_OK)
        {
            status = IS_OK ? OK_MESSAGE : ERROR_MESSAGE;        
        }

        
    }
}