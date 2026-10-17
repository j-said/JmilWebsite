import FormError from '../../ui/FormError';
import FormField from '../../ui/FormField';

export default function CheckoutForm({ formik, total, email }) {
    const isBlocked = formik.isSubmitting;

    return (
        <form onSubmit={formik.handleSubmit} noValidate className="space-y-6 bg-[var(--background)] p-6 rounded-2xl border border-[var(--muted)] shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField formik={formik} name="firstName" label="First Name *" autoComplete="given-name" />
                <FormField formik={formik} name="lastName" label="Last Name *" autoComplete="family-name" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <span className="block text-sm font-medium text-[var(--foreground)] mb-1">Email</span>
                    <p className="px-4 py-3 rounded-xl border border-[var(--muted)] text-[color-mix(in_oklab,var(--foreground)_70%,transparent)]">
                        {email}
                    </p>
                </div>
                <FormField formik={formik} name="phone" label="Phone Number *" type="tel" placeholder="+380..." autoComplete="tel" />
            </div>

            <FormField
                formik={formik}
                name="notes"
                as="textarea"
                rows="3"
                label="Order Notes (Optional)"
                placeholder="Notes about your order, e.g. special notes for delivery."
            />

            {/* Terms Checkbox */}
            <div className="flex items-start pt-2">
                <div className="flex items-center h-6">
                    <input
                        id="terms"
                        type="checkbox"
                        {...formik.getFieldProps({ name: 'terms', type: 'checkbox' })}
                        className="w-5 h-5 rounded border-2 border-[var(--muted)] text-brand-orange focus:ring-brand-orange focus:ring-offset-0 bg-[var(--background)] cursor-pointer accent-brand-orange transition-all"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-[var(--foreground)] cursor-pointer select-none">
                        I have read and agree to the website terms and conditions *
                    </label>
                    <FormError message={formik.touched.terms ? formik.errors.terms : undefined} />
                </div>
            </div>

            {/* Submit Button (Desktop) */}
            <div className="hidden lg:block pt-4">
                <button
                    type="submit"
                    disabled={isBlocked}
                    className={`w-full font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform active:scale-[0.98]
                        ${isBlocked
                            ? 'bg-[var(--muted)] text-[var(--foreground)] opacity-50 cursor-not-allowed'
                            : 'bg-brand-orange text-brand-black hover:bg-brand-yellow'}`
                    }
                >
                    {isBlocked ? 'Processing...' : `Place Order ($${total.toFixed(2)})`}
                </button>
            </div>
        </form>
    );
}
