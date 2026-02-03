using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OMAB.API.Controllers;
using OMAB.Application.Features.Catalog.Queries;

namespace OMAB.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CatalogController : ApiController
{
    [HttpGet("specialties")]
    public async Task<IActionResult> GetAllSpecialties([FromQuery] GetAllSpecialties.Query query)
    {
        var result = await Sender.Send(query);
        return HandleResult(result);
    }

    [HttpGet("medicines")]
    public async Task<IActionResult> GetAllMedicines([FromQuery] GetAllMedicines.Query query)
    {
        var result = await Sender.Send(query);
        return HandleResult(result);
    }

    [HttpGet("diseases")]
    public async Task<IActionResult> GetAllDiseases([FromQuery] GetAllDiseases.Query query)
    {
        var result = await Sender.Send(query);
        return HandleResult(result);
    }
}