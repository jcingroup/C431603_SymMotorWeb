using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.Controllers
{
    public class LoanController : WebUserController
    {
        public ActionResult Index()
        {
            return View("Loan");
        }
        public ActionResult Form()
        {
            return View("Loan_Form");
        }
    }
}
