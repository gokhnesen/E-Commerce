using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Users.Commands.UpdateAddress
{
    public class UpdateAddressCommand : IRequest<UpdateAddressResponse>
    {
        [Required]
        public string Line1 { get; set; } = string.Empty;
        [Required]
        public string? Line2 { get; set; }
        [Required]
        public  string City { get; set; } = string.Empty;
        [Required]
        public  string State { get; set; } = string.Empty;
        [Required]
        public  string Country { get; set; } = string.Empty;
        [Required]
        public string PostalCode { get; set; } = string.Empty;
    }
}
