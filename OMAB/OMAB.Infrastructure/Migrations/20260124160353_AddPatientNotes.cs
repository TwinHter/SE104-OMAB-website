using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OMAB.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPatientNotes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PatientNotes",
                table: "Appointments",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PatientNotes",
                table: "Appointments");
        }
    }
}
