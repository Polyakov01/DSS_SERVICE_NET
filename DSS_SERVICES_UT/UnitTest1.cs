using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace DSS_SERVICES_UT
{
    using MvcApplication1;
    using MvcApplication1.Controllers;
    [TestClass]
    public class UnitTest1
    {
        
        [TestMethod]
        public void TestMethod1()
        {
            WebRequest request = WebRequest.Create("http://localhost/s/test3.php");
            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = data.Length;

            Stream stream = request.GetRequestStream();
            stream.Write(data, 0, data.Length);
            stream.Close();
        }
    }
}
