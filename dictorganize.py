lines = [line.strip() for line in open('googledict.txt')]
dict = {}
for l in lines:
	if (len(l) in dict.keys()):
		dict[len(l)].append(l)
	else:
		dict[len(l)] = []
		dict[len(l)].append(l)

output = ""
for key in dict:
	output += "len" + str(key) + ": [\n"
	for w in dict[key]:
		output += "\'";
		output += w;
		output += "\',\n";
	output += "],\n"

print output