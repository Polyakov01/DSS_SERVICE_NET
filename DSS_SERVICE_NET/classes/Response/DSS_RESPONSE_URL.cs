using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcApplication1.classes
{
    public class DSS_RESPONSE_URL:DSS_RESPONSE
    {
        //public string url { get; set; }

        public DSS_RESPONSE_URL(string _url = null)
            : base(true)
        {
            data = new List<Dictionary<string, dynamic>>();
            var t = new Dictionary<string, dynamic>();
            t.Add("url", _url);
            data.Add(t);
        }
    }
}