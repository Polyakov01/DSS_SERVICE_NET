using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcApplication1.classes
{
    public class DSS_RESPONSE_QUERY:DSS_RESPONSE
    {
        //public dynamic data { get; set; }

        public DSS_RESPONSE_QUERY(dynamic _data = null)
            : base(true)
        {
            data = _data;
        }
    }
}