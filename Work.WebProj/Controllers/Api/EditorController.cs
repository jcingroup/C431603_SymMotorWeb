using DotWeb.Helpers;
using ProcCore.Business;
using ProcCore.Business.DB0;
using ProcCore.HandleResult;
using ProcCore.WebCore;
using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace DotWeb.Api
{
    public class EditorController : ajaxApi<Editor, q_Editor>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            using (db0 = getDB0())
            {
                item = await db0.Editor.FindAsync(id);
                r = new ResultInfo<Editor>() { data = item };
            }

            return Ok(r);
        }
        public async Task<IHttpActionResult> Get([FromUri]q_Editor q)
        {
            #region working

            using (db0 = getDB0())
            {
                var items = db0.Editor
                    .OrderBy(x => x.editor_id)
                    .Select(x => new m_Editor()
                    {
                        editor_id = x.editor_id,
                        name = x.name,
                        sort = x.sort,
                        i_Hide = x.i_Hide
                    });
                if (q.keyword != null)
                {
                    items = items.Where(x => x.name.Contains(q.keyword));
                }
                int page = (q.page == null ? 1 : (int)q.page);
                int startRecord = PageCount.PageInfo(page, this.defPageSize, items.Count());
                var resultItems = await items.Skip(startRecord).Take(this.defPageSize).ToListAsync();

                return Ok(new GridInfo<m_Editor>()
                {
                    rows = resultItems,
                    total = PageCount.TotalPage,
                    page = PageCount.Page,
                    records = PageCount.RecordCount,
                    startcount = PageCount.StartCount,
                    endcount = PageCount.EndCount
                });
            }
            #endregion
        }
        public async Task<IHttpActionResult> Put([FromBody]Editor md)
        {
            ResultInfo rAjaxResult = new ResultInfo();
            try
            {
                db0 = getDB0();

                item = await db0.Editor.FindAsync(md.editor_id);

                var details = item.EditorDetail;

                foreach (var detail in details)
                {
                    var md_detail = md.EditorDetail.First(x => x.editor_detail_id == detail.editor_detail_id);
                    detail.sort = md_detail.sort;
                    detail.detail_name = md_detail.detail_name;
                    detail.detail_content = RemoveScriptTag(md_detail.detail_content);
                    detail.i_Hide = md_detail.i_Hide;
                }

                var add_detail = md.EditorDetail.Where(x => x.edit_state == EditState.Insert);
                foreach (var detail in add_detail)
                {
                    detail.editor_detail_id = GetNewId(CodeTable.EditorDetail);
                    detail.detail_content = RemoveScriptTag(detail.detail_content);
                    detail.i_InsertUserID = this.UserId;
                    detail.i_InsertDateTime = DateTime.Now;
                    detail.i_InsertDeptID = this.departmentId;
                    //detail.i_Lang = System.Globalization.CultureInfo.CurrentCulture.Name;
                    detail.i_Lang = "zh-TW";
                    details.Add(detail);
                }

                item.name = md.name;
                item.sort = md.sort;
                item.i_Hide = md.i_Hide;

                await db0.SaveChangesAsync();
                rAjaxResult.result = true;
            }
            catch (Exception ex)
            {
                rAjaxResult.result = false;
                rAjaxResult.message = ex.ToString();
            }
            finally
            {
                db0.Dispose();
            }
            return Ok(rAjaxResult);
        }
        public async Task<IHttpActionResult> Post([FromBody]Editor md)
        {
            md.editor_id = GetNewId(CodeTable.Editor);

            md.i_InsertDateTime = DateTime.Now;
            md.i_InsertDeptID = this.departmentId;
            md.i_InsertUserID = this.UserId;
            md.i_Lang = "zh-TW";
            r = new ResultInfo<Editor>();
            if (!ModelState.IsValid)
            {
                r.message = ModelStateErrorPack();
                r.result = false;
                return Ok(r);
            }

            try
            {
                #region working
                db0 = getDB0();

                db0.Editor.Add(md);
                await db0.SaveChangesAsync();

                r.result = true;
                r.id = md.editor_id;
                return Ok(r);
                #endregion
            }
            catch (DbEntityValidationException ex) //欄位驗證錯誤
            {
                r.message = getDbEntityValidationException(ex);
                r.result = false;
                return Ok(r);
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message + "\r\n" + getErrorMessage(ex);
                return Ok(r);
            }
            finally
            {
                db0.Dispose();
            }
        }
        public async Task<IHttpActionResult> Delete([FromUri]int[] ids)
        {
            try
            {
                db0 = getDB0();
                r = new ResultInfo<Editor>();
                foreach (var id in ids)
                {
                    item = new Editor() { editor_id = id };
                    db0.Editor.Attach(item);
                    db0.Editor.Remove(item);
                }
                await db0.SaveChangesAsync();

                r.result = true;
                return Ok(r);
            }
            catch (DbUpdateException ex)
            {
                r.result = false;
                if (ex.InnerException != null)
                {
                    r.message = Resources.Res.Log_Err_Delete_DetailExist
                        + "\r\n" + getErrorMessage(ex);
                }
                else
                {
                    r.message = ex.Message;
                }
                return Ok(r);
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
                return Ok(r);
            }
            finally
            {
                db0.Dispose();
            }
        }
    }
    public class q_Editor : QueryBase
    {
        public string keyword { get; set; }
    }
}
