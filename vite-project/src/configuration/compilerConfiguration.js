export const SELECT_LANGUAGE_OPTIONS = [
    {
        value: 'js',
        title: 'JavaScript (Node)'
    },
    {
        value: 'py',
        title: 'Python (3.8)'
    },
    // {
    //     value: 'java',
    //     title: 'Java (14)'
    // },
    {
        value: 'c',
        title: 'C'
    },
    {
        value: 'cpp',
        title: 'C++ (17)'
    },
]

export const HACKER_EARTH_LANGUAGE_FORMAT = {
    js: "JAVASCRIPT_NODE",
    py: "PYTHON3_8",
    // java: "JAVA14",
    c: "C",
    cpp: "CPP17",
};


export const DEFAULT_CODE = {
    js: `const details = 
{
    name:'Vikas',
    project: 'Live-Code-Editor',
}

const printDetails = () => {
    console.log('Hello I am', details.name);
    console.log('This is my', details.project);
    console.log('Hope you like it!');
}

printDetails();
    `,
    py: `def print_details():
    print ('Hello I am Vikas')
    print ('This is my Live-Code-Editor')
    print ('Hope you like it!')
print_details()`,
    // java: `class HelloWorld {
    //     public static void main(String[] args) {
    //         System.out.println("Hello I am Vikas");
    //         System.out.println("This is my Live-Code-Editor");
    //         System.out.println("Hope you like it!");
    //     }
    // }`,
    cpp: `#include <bits/stdc++.h>
using namespace std;

int main(){
    cout<<"Hello I am Vikas"<<endl;
    cout<<"This is my Live-Code-Editor"<<endl;
    cout<<"Hope you like it!"<<endl;
}
`,
    c: `#include <stdio.h>

int main(){
    printf("%s", "Hello I am Vikas\\n");
    printf("%s", "This is my Live-Code-Editor\\n");
    printf("%s", "Hope you like it!\\n");
}`,
};