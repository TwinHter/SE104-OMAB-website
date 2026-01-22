using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace Backend.Api.Controllers
{
    [ApiController]
    [Route("api/specialties")]
    public class SpecialtiesController : ControllerBase
    {
        // For simplicity, using a static list.
        // In a real app, this might come from a database.
        private static readonly List<string> _specialties = new List<string>
        {
            "Tim Mạch",
            "Da Liễu",
            "Thần Kinh",
            "Nội Tổng Quát",
            "Nhi Khoa",
            "Phụ Sản",
            "Răng Hàm Mặt",
            "Mắt",
            "Tai Mũi Họng",
            "Xương Khớp",
            "Tiêu Hóa",
            "Hô Hấp",
            "Dinh Dưỡng",
            "Vật Lý Trị Liệu"
        };

        [HttpGet]
        public IActionResult GetSpecialties()
        {
            try
            {
                return Ok(_specialties);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching specialties", error = ex.Message });
            }
        }
    }
}