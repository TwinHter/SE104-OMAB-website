using System;

namespace OMAB.Domain.Common;

public record DomainError(bool IsSuccess, string? ErrorMessage);
