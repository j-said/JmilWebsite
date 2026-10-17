import FormError from './FormError';

/** Labeled input bound to a Formik field. Pass `as="textarea"` for multi-line text. */
export default function FormField({ formik, name, label, as: Tag = 'input', type = 'text', ...props }) {
    const error = formik.touched[name] ? formik.errors[name] : undefined;
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-[var(--foreground)] mb-1">
                {label}
            </label>
            <Tag
                id={name}
                type={Tag === 'input' ? type : undefined}
                {...formik.getFieldProps(name)}
                {...props}
                aria-invalid={Boolean(error)}
                className={`w-full px-4 py-3 rounded-xl border bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-colors ${Tag === 'textarea' ? 'resize-none' : ''}
                    ${error ? 'border-red-500' : 'border-[var(--muted)]'}`}
            />
            <FormError message={error} />
        </div>
    );
}
