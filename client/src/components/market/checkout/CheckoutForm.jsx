import FormError from '../../ui/FormError';

export default function CheckoutForm({ formik, total }) {
    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6 bg-[var(--background)] p-6 rounded-2xl border border-[var(--muted)] shadow-sm">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-[var(--foreground)] mb-1">First Name *</label>
                    <input
                        id="firstName"
                        type="text"
                        {...formik.getFieldProps('firstName')}
                        className={`w-full px-4 py-3 rounded-xl border bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-colors
                            ${formik.touched.firstName && formik.errors.firstName ? 'border-red-500' : 'border-[var(--muted)]'}`}
                    />
                    {formik.touched.firstName && <FormError message={formik.errors.firstName} />}
                </div>

                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-[var(--foreground)] mb-1">Last Name *</label>
                    <input
                        id="lastName"
                        type="text"
                        {...formik.getFieldProps('lastName')}
                        className={`w-full px-4 py-3 rounded-xl border bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-colors
                            ${formik.touched.lastName && formik.errors.lastName ? 'border-red-500' : 'border-[var(--muted)]'}`}
                    />
                    {formik.touched.lastName && <FormError message={formik.errors.lastName} />}
                </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-1">Email *</label>
                    <input
                        id="email"
                        type="email"
                        {...formik.getFieldProps('email')}
                        className={`w-full px-4 py-3 rounded-xl border bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-colors
                            ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-[var(--muted)]'}`}
                    />
                    {formik.touched.email && <FormError message={formik.errors.email} />}
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[var(--foreground)] mb-1">Phone Number *</label>
                    <input
                        id="phone"
                        type="tel"
                        {...formik.getFieldProps('phone')}
                        placeholder="+380..."
                        className={`w-full px-4 py-3 rounded-xl border bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-colors
                            ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-[var(--muted)]'}`}
                    />
                    {formik.touched.phone && <FormError message={formik.errors.phone} />}
                </div>
            </div>

            {/* Optional Notes */}
            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Order Notes <span className="text-[var(--muted)] font-normal">(Optional)</span>
                </label>
                <textarea
                    id="notes"
                    rows="3"
                    {...formik.getFieldProps('notes')}
                    placeholder="Notes about your order, e.g. special notes for delivery."
                    className="w-full px-4 py-3 rounded-xl border border-[var(--muted)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-colors resize-none"
                />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start pt-2">
                <div className="flex items-center h-6">
                    <input
                        id="terms"
                        type="checkbox"
                        {...formik.getFieldProps('terms')}
                        className="w-5 h-5 rounded border-2 border-[var(--muted)] text-brand-orange focus:ring-brand-orange focus:ring-offset-0 bg-[var(--background)] cursor-pointer accent-brand-orange transition-all"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-[var(--foreground)] cursor-pointer select-none">
                        I have read and agree to the website <a href="#" className="text-brand-orange hover:underline">terms and conditions</a> *
                    </label>
                    {formik.touched.terms && <FormError message={formik.errors.terms} />}
                </div>
            </div>

            {/* Submit Button (Desktop) */}
            <div className="hidden lg:block pt-4">
                <button
                    type="submit"
                    disabled={formik.isSubmitting || !formik.isValid}
                    className={`w-full font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform active:scale-[0.98]
                        ${formik.isSubmitting || !formik.isValid
                            ? 'bg-[var(--muted)] text-[var(--foreground)] opacity-50 cursor-not-allowed'
                            : 'bg-brand-orange text-brand-black hover:bg-brand-yellow'}`
                    }
                >
                    {formik.isSubmitting ? 'Processing...' : `Place Order ($${total.toFixed(2)})`}
                </button>
            </div>
        </form>
    );
}