using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcApplication1.classes
{
    public class DSS_RESPONSE_KEY:DSS_RESPONSE
    {
        public string key { get; set; }

        public DSS_RESPONSE_KEY(string _key = null)
            : base(true)
        {
            key = _key;
        }
    }
}