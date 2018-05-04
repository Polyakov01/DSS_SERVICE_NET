using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcApplication1.classes
{
    public class DSS_RESPONSE_FILE : DSS_RESPONSE
    {
        public string fileName { get; set; }

        public DSS_RESPONSE_FILE(string _fileName = null)
            : base(true)
        {
            fileName = _fileName;
        }
    }
}