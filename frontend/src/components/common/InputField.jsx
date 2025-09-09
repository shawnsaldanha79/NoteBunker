const InputField = ({
    label,
    id,
    type,
    errors,
    register,
    required,
    message,
    className,
    min,
    value,
    autoFocus,
    placeholder,
    readOnly,
}) => {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <label
                htmlFor={id}
                className="font-semibold text-md text-yellow-300"
            >
                {label}
            </label>

            <input
                type={type}
                id={id}
                value={value}
                placeholder={placeholder}
                className={`px-4 py-3 border-2 ${
                    autoFocus ? "border-yellow-400" : "border-gray-700"
                } outline-none bg-gray-800 text-gray-100 rounded-lg ${
                    errors[id]?.message
                        ? "border-red-500"
                        : "border-gray-700 focus:border-yellow-500"
                } transition-colors duration-200`}
                {...register(id, {
                    required: { value: required, message },
                    minLength: min
                        ? {
                              value: min,
                              message: "Minimum 6 character is required",
                          }
                        : null,
                })}
                readOnly={readOnly}
            />

            {errors[id]?.message && (
                <p className="text-sm font-semibold text-red-400 mt-1">
                    {errors[id]?.message}*
                </p>
            )}
        </div>
    );
};

export default InputField;
