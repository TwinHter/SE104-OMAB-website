using System.Collections.Generic;

namespace Backend.Core.Models
{
    public class Medicine
    {
        // Sử dụng int cho Primary Key ở bảng tham số sẽ hiệu quả hơn
        public int Id { get; set; } 
        public string Name { get; set; }

        // Navigation property: Một loại thuốc có thể được kê trong nhiều đơn thuốc (Medication)
        public ICollection<Medication> Prescriptions { get; set; } = new List<Medication>();
    }
}