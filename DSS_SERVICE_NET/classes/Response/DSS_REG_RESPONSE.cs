using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcApplication1
{
    public class DSS_REG_RESPONSE
    {
        public string cart_ID { get; set; }
       // public string consumer_BIN { get; set; }
        public string request_ID { get; set; }
        public string  consumer_ID { get; set; }
        public dynamic items { get; set; }
        private const string OK_MESSAGE = "OK";
        private const string ERROR_MESSAGE = "ERROR";

        public DSS_REG_RESPONSE(String _cart_ID,String _request_ID,String _consumer_ID ,dynamic _data = null)
        {
            cart_ID = _cart_ID;
           // consumer_BIN = _consumer_BIN;
            request_ID = _request_ID;
            consumer_ID = _consumer_ID;            
            items = _data;       
        }

        
    }
}