using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcApplication1.classes
{
    public class DSS_RESPONSE_ERROR:DSS_RESPONSE
    {
        public string message { get; set; }
        
        public DSS_RESPONSE_ERROR(string _errorMsg = null):base(false)
        {            
            message = _errorMsg;
        }
    }
}