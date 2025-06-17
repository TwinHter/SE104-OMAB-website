using Microsoft.AspNetCore.Mvc;
using Backend.Api.DTOs;
using Backend.Core.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Core.Models;

namespace Backend.Api.Controllers
{
    [ApiController]
    [Route("api/relatives")]
    public class RelativesController : ControllerBase
    {
        private readonly IRelativeRepository _relativeRepository;

        public RelativesController(IRelativeRepository relativeRepository)
        {
            _relativeRepository = relativeRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetRelatives()
        {
            try
            {
                var relatives = await _relativeRepository.GetAllAsync();
                var relativeDtos = relatives.Select(r => new RelativeDto
                {
                    Id = r.Id,
                    Name = r.Name,
                    Relationship = r.Relationship,
                    Phone = r.Phone
                }).ToList();

                return Ok(relativeDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching relatives", error = ex.Message });
            }
        }

        // Add POST/PATCH/DELETE methods for relatives if needed.
        [HttpPost]
        public async Task<IActionResult> CreateRelative([FromBody] CreateRelativeDto createRelativeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var relative = new Relative
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = createRelativeDto.Name,
                    Relationship = createRelativeDto.Relationship,
                    Phone = createRelativeDto.Phone
                };

                await _relativeRepository.AddAsync(relative);
                return CreatedAtAction(nameof(GetRelatives), new { id = relative.Id }, relative);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating relative", error = ex.Message });
            }
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateRelative(string id, [FromBody] UpdateRelativeDto updateRelativeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var relative = await _relativeRepository.GetByIdAsync(id);
                if (relative == null)
                    return NotFound();

                relative.Name = updateRelativeDto.Name;
                relative.Relationship = updateRelativeDto.Relationship;
                relative.Phone = updateRelativeDto.Phone;

                await _relativeRepository.UpdateAsync(relative);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating relative", error = ex.Message });
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRelative(string id, [FromBody] DeleteRelativeDto deleteRelativeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var relative = await _relativeRepository.GetByIdAsync(id);
                if (relative == null)
                    return NotFound();

                await _relativeRepository.DeleteAsync(relative);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting relative", error = ex.Message });
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRelativeById(string id)
        {
            try
            {
                var relative = await _relativeRepository.GetByIdAsync(id);
                if (relative == null)
                    return NotFound();

                var relativeDto = new RelativeDto
                {
                    Id = relative.Id,
                    Name = relative.Name,
                    Relationship = relative.Relationship,
                    Phone = relative.Phone
                };

                return Ok(relativeDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching relative", error = ex.Message });
            }
        }
    }
}