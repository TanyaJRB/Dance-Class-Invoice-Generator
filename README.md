Personal repo. 

Removed user.ts file with details from git. For it to run, you will need to add your own user.ts file under src/classes/user.ts and provide the following details instead of the capitals:

export const fullName = 'YOUR NAME';
export const niNumber = 'YOUR NI NUMBER';

export const bankDetails = {
    bankName: 'BANK NAME',
    acHolder: 'AC NAME',
    acNumber: 'AC NUMBER',
    sortCode: 'SORTCODE'
};

export const disclaimer = 'SAMPLE DISCLAIMER eg I am working for X in a freelance capacity and declare that I am fully responsible for my own tax and NI contribution.';

export const signature = 'SIGNATURE';
