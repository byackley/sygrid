export function gcd(x:number, y:number):number {
    if (x<0) return gcd(-x,y);
    if (x<y) return gcd(y,x);
    if (x==y) return x;
    if (y==0) return x;
    if (y==1) return 1;
    return gcd(y, x%y);
}
