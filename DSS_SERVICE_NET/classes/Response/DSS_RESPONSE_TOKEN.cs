using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcApplication1.classes
{
    public class DSS_RESPONSE_TOKEN:DSS_RESPONSE
    {
        public string token { get; set; }
        
        public DSS_RESPONSE_TOKEN(string _token = null):base(true)
        {
            token = _token;
        }
    }
}