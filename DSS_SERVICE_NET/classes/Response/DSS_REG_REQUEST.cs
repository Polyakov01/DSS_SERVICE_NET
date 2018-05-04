using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcApplication1
{
    public class DSS_REG_REQUEST
    {
        public string cart_ID { get; set; }
        public string consumer_BIN { get; set; }
        public string request_ID { get; set; }
        public string consumer_ID { get; set; }
        public dynamic items { get; set; }
        private const string OK_MESSAGE = "OK";
        private const string ERROR_MESSAGE = "ERROR";

        public DSS_REG_REQUEST(String _cart_ID, dynamic _data = null)
        {
            cart_ID = _cart_ID;
            items = _data;  
        }

        
    }
}