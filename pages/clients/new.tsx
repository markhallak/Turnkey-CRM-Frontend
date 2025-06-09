import Wrapper from "@/components/Wrapper";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";

const formSchema = z.object({
    companyName: z.string().min(1, "Required"),
    POCFirstName: z.string().min(1, "Required"),
    POCLastName: z.string().min(1, "Required"),
    type: z.string().min(1, "Required"),
    onBoardingEmail: z.string().min(1, "Required").email("Invalid email address"),
    phoneNumber: z.string().min(1, "Required").regex(/^\+\d{1,3}\s\d+$/, "Phone number must be in format +CCC XXXXXXXXXX"),
    accountingEmail: z.string().min(1, "Required").email("Invalid email address"),
    accountingPhoneNumber: z.string().min(1, "Required").regex(/^\+\d{1,3}\s\d+$/, "Phone number must be in format +CCC XXXXXXXXXX"),
    payterms: z.string().min(1, "Required"),
    assignee: z.string().min(1, "Required"),
    address1: z.string().min(1, "Required"),
    address2: z.string().optional(),
    city: z.string().min(1, "Required"),
    state: z.string().min(1, "Required"),
    zipCode: z.string().min(1, "Required").regex(/^\d{4,5}$/, "Zip Code must be 4 or 5 digits"),
    tripRate: z.string().min(1, "Required").regex(/^\d+\.\d{2}$/, "Amount must have two decimal places"),
    hourlyRateHandyMan: z.string().min(1, "Required").regex(/^\d+\.\d{2}$/, "Amount must have two decimal places"),
    hourlyRateHelper: z.string().min(1, "Required").regex(/^\d+\.\d{2}$/, "Amount must have two decimal places"),
    hourlyRateElectrical: z.string().min(1, "Required").regex(/^\d+\.\d{2}$/, "Amount must have two decimal places"),
    hourlyRatePlumbing: z.string().min(1, "Required").regex(/^\d+\.\d{2}$/, "Amount must have two decimal places"),
    hourlyRateHVAC: z.string().min(1, "Required").regex(/^\d+\.\d{2}$/, "Amount must have two decimal places"),
});

type FormValues = z.infer<typeof formSchema>;

const NewClient = () => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = form;

    function onSubmit(values: FormValues) {
        console.log(values);
    }

    return (
        <Wrapper title="New Client">
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col px-6 sm:px-0 md: px-0 lg:px-0 pt-6">
                    <div className="border p-6 mb-8 rounded-md space-y-4 w-full mt-5 mx-auto">
                        <div className="grid lg:grid-cols-4 gap-4 pb-5">
                            <div>
                                <label className="text-sm">Company Name</label>
                                <Input className="mt-1.5" {...register("companyName")} />
                                {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName.message}</p>}
                            </div>
                            <div>
                                <label className="text-sm">POC First Name</label>
                                <Input className="mt-1.5" {...register("POCFirstName")} />
                                {errors.POCFirstName && <p className="text-red-500 text-sm">{errors.POCFirstName.message}</p>}
                            </div>
                            <div>
                                <label className="text-sm">POC Last Name</label>
                                <Input className="mt-1.5" {...register("POCLastName")} />
                                {errors.POCLastName && <p className="text-red-500 text-sm">{errors.POCLastName.message}</p>}
                            </div>
                            <div>
                                <label className="text-sm">Type</label>
                                <Select onValueChange={(value) => setValue("type", value)}>
                                    <SelectTrigger className="mt-1.5">
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="client1">Type 1</SelectItem>
                                        <SelectItem value="client2">Type 2</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-4 gap-4 border-y pt-6 pb-10">
                            <div>
                                <label className="text-sm">Address Line 1</label>
                                <Input className="mt-1.5" {...register("address1")} />
                                {errors.address1 && <p className="text-red-500 text-sm">{errors.address1.message}</p>}
                            </div>
                            <div>
                                <label className="text-sm">Address Line 2</label>
                                <Input className="mt-1.5" {...register("address2")} />
                            </div>
                            <div>
                                <label className="text-sm">City</label>
                                <Input className="mt-1.5" {...register("city")} />
                                {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                            </div>
                            <div>
                                <label className="text-sm">State</label>
                                <Select onValueChange={(value) => setValue("state", value)}>
                                    <SelectTrigger className="mt-1.5">
                                        <SelectValue placeholder="Select State" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="state1">State 1</SelectItem>
                                        <SelectItem value="state2">State 2</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
                            </div>
                            <div>
                                <label className="text-sm">Zip Code</label>
                                <Input className="mt-1.5" {...register("zipCode")} />
                                {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode.message}</p>}
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-4 gap-4 border-b pt-2 pb-10">
                            <div>
                                <label className="text-sm">General / On-boarding Email</label>
                                <Input type="email" className="mt-1.5" {...register("onBoardingEmail")} />
                                {errors.onBoardingEmail && <p className="text-red-500 text-sm">{errors.onBoardingEmail.message}</p>}
                            </div>
                            <div>
                                <label className="text-sm">Phone Number / Main Line</label>
                                <Controller name="phoneNumber" control={control} render={({ field }) => (
                                    <Input
                                        type="tel"
                                        inputMode="tel"
                                        className="mt-1.5"
                                        {...field}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^+\d]/g, "");
                                            const match = val.match(/^(\+\d{1,3})(\d*)$/);
                                            field.onChange(match ? `${match[1]} ${match[2]}` : val);
                                        }}
                                    />
                                )} />
                                {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                            </div>
                            <div>
                                <label className="text-sm">Accounting Email</label>
                                <Input type="email" className="mt-1.5" {...register("accountingEmail")} />
                                {errors.accountingEmail && <p className="text-red-500 text-sm">{errors.accountingEmail.message}</p>}
                            </div>
                            <div>
                                <label className="text-sm">Accounting Phone Number</label>
                                <Controller name="accountingPhoneNumber" control={control} render={({ field }) => (
                                    <Input
                                        type="tel"
                                        inputMode="tel"
                                        className="mt-1.5"
                                        {...field}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^+\d]/g, "");
                                            const match = val.match(/^(\+\d{1,3})(\d*)$/);
                                            field.onChange(match ? `${match[1]} ${match[2]}` : val);
                                        }}
                                    />
                                )} />
                                {errors.accountingPhoneNumber && <p className="text-red-500 text-sm">{errors.accountingPhoneNumber.message}</p>}
                            </div>
                            <div>
                                <label className="text-sm">Pay Terms</label>
                                <Select onValueChange={(value) => setValue("payterms", value)}>
                                    <SelectTrigger className="mt-1.5">
                                        <SelectValue placeholder="Select Pay Term" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                        <SelectItem value="Weekly">Weekly</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.payterms && <p className="text-red-500 text-sm">{errors.payterms.message}</p>}
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-4 gap-4 pt-2 pb-10">
                            <div>
                                <label className="text-sm">Trip Rate</label>
                                <div className="relative mt-1.5">
                                    <span className="pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                                    <Input type="text" inputMode="decimal" pattern="\d+(\.\d{2})" className="pl-7" {...register("tripRate")} />
                                </div>
                                {errors.tripRate && <p className="text-red-500 text-sm">{errors.tripRate.message}</p>}
                            </div>
                            <div>
                                <label className="text-sm">Hourly Rate Handyman</label>
                                <div className="relative mt-1.5">
                                    <span className="pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                                    <Input type="text" inputMode="decimal" pattern="\d+(\.\d{2})" className="pl-7" {...register("hourlyRateHandyMan")} />
                                </div>
                                {errors.hourlyRateHandyMan && <p className="text-red-500 text-sm">{errors.hourlyRateHandyMan.message}</p>}
                            </div>
                            <div>
                                <label className="text-sm">Hourly Rate Helper</label>
                                <div className="relative mt-1.5">
                                    <span className="pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                                    <Input type="text" inputMode="decimal" pattern="\d+(\.\d{2})" className="pl-7" {...register("hourlyRateHelper")} />
                                </div>
                                {errors.hourlyRateHelper && <p className="text-red-500 text-sm">{errors.hourlyRateHelper.message}</p>}
                            </div>
                            <div>
                                <label className="text-sm">Hourly Rate Electrical</label>
                                <div className="relative mt-1.5">
                                    <span className="pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                                    <Input type="text" inputMode="decimal" pattern="\d+(\.\d{2})" className="pl-7" {...register("hourlyRateElectrical")} />
                                </div>
                                {errors.hourlyRateElectrical && <p className="text-red-500 text-sm">{errors.hourlyRateElectrical.message}</p>}
                            </div>
                            <div>
                                <label className="text-sm">Hourly Rate Plumbing</label>
                                <div className="relative mt-1.5">
                                    <span className="pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                                    <Input type="text" inputMode="decimal" pattern="\d+(\.\d{2})" className="pl-7" {...register("hourlyRatePlumbing")} />
                                </div>
                                {errors.hourlyRatePlumbing && <p className="text-red-500 text-sm">{errors.hourlyRatePlumbing.message}</p>}
                            </div>
                            <div>
                                <label className="text-sm">Hourly Rate HVAC</label>
                                <div className="relative mt-1.5">
                                    <span className="pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                                    <Input type="text" inputMode="decimal" pattern="\d+(\.\d{2})" className="pl-7" {...register("hourlyRateHVAC")} />
                                </div>
                                {errors.hourlyRateHVAC && <p className="text-red-500 text-sm">{errors.hourlyRateHVAC.message}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 mb-16">
                        <Button
                            variant="outline"
                            className="px-4 flex items-center py-3 h-9 md:py-1 w-full md:w-36 text-sm font-medium rounded-md"
                            asChild
                        >
                            <Link href="/clients">Cancel</Link>
                        </Button>
                        <Button type="submit" variant="outline" className="px-4 flex items-center py-3 h-9 md:py-1 w-full md:w-36 text-sm font-medium text-white rounded-md bg-blue-600 hover:bg-white">
                            Create Client
                        </Button>
                    </div>
                </form>
            </Form>
        </Wrapper>
    );
};

export default NewClient;