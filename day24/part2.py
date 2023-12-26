from sympy import solve
from sympy import symbols

a, b, c, x, y, z, r, s, t = symbols('a b c x y z r s t', real=True)

r = solve([
342948424011438-59*a-x-a*r,
174891902666380-15*a-y-a*s,
342806081991021-33*a-z-a*t,
293706396323705-31*b-x-b*r,
260477020213330+22*b-y-b*s,
361057996757008-178*b-z-b*t,
349281020720534-154*c-x-c*r,
232777231877012+120*c-y-c*s,
244513365239874+24*c-z-c*t,
],
[a, b, c, x, y, z, r, s, t],
dict=True
)
print(r)

sum = 261502975177164 + 428589795012222 + 196765966839909
print(sum)