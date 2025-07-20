

export type User = {
    name: string;
    lastName: string;
    email: string;
    address : Address;
}

export type Address = {
    line1: string;
    line2: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;

}