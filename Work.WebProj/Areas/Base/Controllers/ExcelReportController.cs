using DotWeb.Controller;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using ProcCore.Business.DB0;
using ProcCore.Business.LogicConect;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DotWeb.Areas.Base.Controllers
{
    public class ExcelReportController : AdminController
    {
        // GET: ExcelReport
        //public FileResult downloadExcel_SalesRankData()
        //{
        //    ExcelPackage excel = null;
        //    MemoryStream fs = null;
        //    var db0 = getDB0();
        //    try
        //    {

        //        fs = new MemoryStream();
        //        excel = new ExcelPackage(fs);
        //        excel.Workbook.Worksheets.Add("SalesRankData");
        //        ExcelWorksheet sheet = excel.Workbook.Worksheets["SalesRankData"];

        //        sheet.View.TabSelected = true;
        //        #region 取得客戶拜訪紀錄
        //        var items = (from x in db0.Sales
        //                     orderby x.sales_no
        //                     select (new m_Sales()
        //                     {
        //                         sales_no = x.sales_no,
        //                         sales_name = x.sales_name,
        //                         join_date = x.join_date,
        //                         tel = x.tel,
        //                         mobile = x.mobile,
        //                         zip = x.zip,
        //                         address = x.address,
        //                         rank = x.rank,
        //                         sub_count = x.SalesSub.Count()
        //                     }));


        //        var getPrintVal = items.ToList();


        //        #endregion


        //        #region Excel Handle

        //        int detail_row = 3;

        //        #region 標題
        //        sheet.Cells[1, 1].Value = "符合經理人資格之會員名單";
        //        sheet.Cells[1, 1, 1, 9].Merge = true;
        //        sheet.Cells[2, 1].Value = "[會員編號]";
        //        sheet.Cells[2, 2].Value = "[會員名稱]";
        //        sheet.Cells[2, 3].Value = "[加入日期]";
        //        sheet.Cells[2, 4].Value = "[電話]";
        //        sheet.Cells[2, 5].Value = "[手機]";
        //        sheet.Cells[2, 6].Value = "[郵遞區號]";
        //        sheet.Cells[2, 7].Value = "[地址]";
        //        sheet.Cells[2, 8].Value = "[會員階級]";
        //        sheet.Cells[2, 9].Value = "[直推會員數]";
        //        setFontColor_Label(sheet, 2, 1, 9);
        //        setFontColor_blue(sheet, 1, 1);
        //        #endregion

        //        #region 內容
        //        foreach (var item in getPrintVal)
        //        {

        //            sheet.Cells[detail_row, 1].Value = item.sales_no;
        //            sheet.Cells[detail_row, 2].Value = item.sales_name;
        //            sheet.Cells[detail_row, 3].Value = item.join_date.ToString("yyyy/MM/dd");
        //            sheet.Cells[detail_row, 4].Value = item.tel;
        //            sheet.Cells[detail_row, 5].Value = item.mobile;
        //            sheet.Cells[detail_row, 6].Value = item.zip;
        //            sheet.Cells[detail_row, 7].Value = item.address;
        //            sheet.Cells[detail_row, 8].Value = CodeSheet.GetStateVal(item.rank, CodeSheet.sales_rank);
        //            sheet.Cells[detail_row, 9].Value = item.sub_count;

        //            detail_row++;
        //        }
        //        #endregion

        //        #region excel排版
        //        int startColumn = sheet.Dimension.Start.Column;
        //        int endColumn = sheet.Dimension.End.Column;
        //        for (int j = startColumn; j <= endColumn; j++)
        //        {
        //            //sheet.Column(j).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;//靠左對齊
        //            //sheet.Column(j).Width = 30;//固定寬度寫法
        //            sheet.Column(j).AutoFit();//依內容fit寬度
        //        }//End for
        //        #endregion
        //        //sheet.Cells.Calculate(); //要對所以Cell做公計計算 否則樣版中的公式值是不會變的

        //        #endregion

        //        string filename = "會員推薦人數" + "[" + DateTime.Now.ToString("yyyyMMddHHmm") + "].xlsx";
        //        excel.Save();
        //        fs.Position = 0;
        //        return File(fs, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename);
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.Write(ex.Message);
        //        return null;
        //    }
        //    finally
        //    {
        //        db0.Dispose();
        //    }
        //}
        //public FileResult downloadExcel_SalesData()
        //{
        //    ExcelPackage excel = null;
        //    MemoryStream fs = null;
        //    var db0 = getDB0();
        //    try
        //    {

        //        fs = new MemoryStream();
        //        excel = new ExcelPackage(fs);
        //        excel.Workbook.Worksheets.Add("SalesData");
        //        ExcelWorksheet sheet = excel.Workbook.Worksheets["SalesData"];

        //        sheet.View.TabSelected = true;
        //        #region 取得客戶資料
        //        var items = (from x in db0.Sales
        //                     orderby x.sales_no
        //                     where x.sales_no != "A"
        //                     select (new m_Sales()
        //                     {
        //                         sales_no = x.sales_no,
        //                         sales_name = x.sales_name,
        //                         tel = x.tel,
        //                         mobile = x.mobile,
        //                         zip = x.zip,
        //                         address = x.address
        //                     }));


        //        var getPrintVal = items.ToList();


        //        #endregion


        //        #region Excel Handle

        //        int detail_row = 3;

        //        #region 標題
        //        sheet.Cells[1, 1].Value = "會員名單";
        //        sheet.Cells[1, 1, 1, 4].Merge = true;
        //        sheet.Cells[2, 1].Value = "[姓名]";
        //        sheet.Cells[2, 2].Value = "[手機]";
        //        sheet.Cells[2, 3].Value = "[郵遞區號]";
        //        sheet.Cells[2, 4].Value = "[地址]";
        //        setFontColor_Label(sheet, 2, 1, 4);
        //        setFontColor_blue(sheet, 1, 1);
        //        #endregion

        //        #region 內容
        //        foreach (var item in getPrintVal)
        //        {

        //            sheet.Cells[detail_row, 1].Value = item.sales_name;
        //            sheet.Cells[detail_row, 2].Value = item.mobile;
        //            sheet.Cells[detail_row, 3].Value = item.zip;
        //            sheet.Cells[detail_row, 4].Value = item.address;

        //            detail_row++;
        //        }
        //        #endregion

        //        #region excel排版
        //        int startColumn = sheet.Dimension.Start.Column;
        //        int endColumn = sheet.Dimension.End.Column;
        //        for (int j = startColumn; j <= endColumn; j++)
        //        {
        //            //sheet.Column(j).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;//靠左對齊
        //            //sheet.Column(j).Width = 30;//固定寬度寫法
        //            sheet.Column(j).AutoFit();//依內容fit寬度
        //        }//End for
        //        #endregion
        //        //sheet.Cells.Calculate(); //要對所以Cell做公計計算 否則樣版中的公式值是不會變的

        //        #endregion

        //        string filename = "會員名單" + "[" + DateTime.Now.ToString("yyyyMMddHHmm") + "].xlsx";
        //        excel.Save();
        //        fs.Position = 0;
        //        return File(fs, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename);
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.Write(ex.Message);
        //        return null;
        //    }
        //    finally
        //    {
        //        db0.Dispose();
        //    }
        //}


        public void setCellBackgroundColor_MonthHead(ExcelWorksheet sheet, int row, int column)
        {
            sheet.Cells[row, column].Style.Font.Size = 14;//文字大小設定14
            sheet.Cells[row, column].Style.Font.Name = "微軟正黑體";
            sheet.Cells[row, column].Style.Fill.PatternType = ExcelFillStyle.Solid;
            sheet.Cells[row, column].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.DeepSkyBlue);
        }
        public void setCellBackgroundColor_Label(ExcelWorksheet sheet, int row, int start_column, int end_column)
        {
            for (; start_column <= end_column; start_column++)
            {
                sheet.Cells[row, start_column].Style.Fill.PatternType = ExcelFillStyle.Solid;
                sheet.Cells[row, start_column].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightSkyBlue);
            }
        }
        public void setFontColor_Label(ExcelWorksheet sheet, int row, int start_column, int end_column)
        {
            for (; start_column <= end_column; start_column++)
            {
                sheet.Cells[row, start_column].Style.Font.Bold = true;
                sheet.Cells[row, start_column].Style.Font.Color.SetColor(System.Drawing.Color.Blue);
                sheet.Cells[row, start_column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            }
        }
        public void setFontColor_LabelBord(ExcelWorksheet sheet, int row, int start_column, int end_column)
        {
            for (; start_column <= end_column; start_column++)
            {
                sheet.Cells[row, start_column].Style.Font.Bold = true;
                sheet.Cells[row, start_column].Style.Font.Color.SetColor(System.Drawing.Color.Blue);
                sheet.Cells[row, start_column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                sheet.Cells[row, start_column].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);//儲存格框線
            }
        }
        public void setFontColor_blue(ExcelWorksheet sheet, int row, int column)
        {
            sheet.Cells[row, column].Style.Font.Bold = true;
            sheet.Cells[row, column].Style.Font.Color.SetColor(System.Drawing.Color.Blue);
            sheet.Cells[row, column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        }
        public void setFontColor_red(ExcelWorksheet sheet, int row, int column)
        {
            sheet.Cells[row, column].Style.Font.Bold = true;
            sheet.Cells[row, column].Style.Font.Color.SetColor(System.Drawing.Color.Red);
        }
        public void setFontColorAndBg_DeepSkyBlue(ExcelWorksheet sheet, int row, int column)
        {
            sheet.Cells[row, column].Style.Font.Bold = true;
            sheet.Cells[row, column].Style.Font.Color.SetColor(System.Drawing.Color.White);
            sheet.Cells[row, column].Style.Fill.PatternType = ExcelFillStyle.Solid;
            sheet.Cells[row, column].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.DeepSkyBlue);
            sheet.Cells[row, column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        }
        public void setFontColorAndBg_Blue(ExcelWorksheet sheet, int row, int column)
        {
            sheet.Cells[row, column].Style.Font.Bold = true;
            sheet.Cells[row, column].Style.Font.Color.SetColor(System.Drawing.Color.White);
            sheet.Cells[row, column].Style.Fill.PatternType = ExcelFillStyle.Solid;
            sheet.Cells[row, column].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Blue);
            sheet.Cells[row, column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        }
        public void setMerge_label(ExcelWorksheet sheet, int start_row, int end_row, int start_column, int end_column)
        {
            for (; start_column <= end_column; start_column++)
            {
                sheet.Cells[start_row, start_column, end_row, start_column].Merge = true;
            }
        }
        public void setBroder_red(ExcelWorksheet sheet, int row, int start_column, int end_column)
        {
            for (; start_column <= end_column; start_column++)
            {
                sheet.Cells[row, start_column].Style.Border.Top.Style = ExcelBorderStyle.Thick;
                sheet.Cells[row, start_column].Style.Border.Top.Color.SetColor(System.Drawing.Color.Red);
            }
        }
        /// <summary>
        /// excel 換行設定 
        /// </summary>
        /// <param name="sheet"></param>
        /// <param name="row"></param>
        /// <param name="start_column"></param>
        /// <param name="end_column"></param>
        public void setWrapText(ExcelWorksheet sheet, int row, int start_column, int end_column)
        {
            for (; start_column <= end_column; start_column++)
            {
                sheet.Cells[row, start_column].Style.WrapText = true;
            }
        }
    }
    public class PQList
    {
        public int p_id { get; set; }
        public decimal qty { get; set; }
    }
    public class SalesList
    {
        public string Name { get; set; }
        public IList<ProductList> items { get; set; }
    }
    public class ProductList
    {
        public int product_id { get; set; }
        public string product_name { get; set; }
        public bool have { get; set; }
        public decimal Sum { get; set; }
    }
    public class ParmGetAllPurchase
    {
        public DateTime? start_date { get; set; }
        public DateTime? end_date { get; set; }
        public string keyword { get; set; }
        public int? source { get; set; }
        public int? state { get; set; }
    }
    public class ParmGetSettleData
    {
        public int main_id { get; set; }
    }
}