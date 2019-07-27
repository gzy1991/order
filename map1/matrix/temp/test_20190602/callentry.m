function [x, y, z] = callentry(a, b);
x = add(a, b)
y = mul(a, b)
z = callsub(a, b)
end

function l = mul(m, n);
l=m*n;
end

function l = add(m, n);
l=m+n;
end