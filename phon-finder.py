# coding:utf8

#########################
# PHONOLOGICAL ENVIRONMENT FILTERER
# zhouluke. October 2016.
#########################

import os
import re 	# regex
import sys
import io


inFile = sys.argv[1] 
phone = sys.argv[2] 


# Example use:
# python phon-finder.py Oct14Data.txt 'k' > k.txt


#word = None
#if (len(sys.argv)>2):
#	word = sys.argv[2]

found = {}
counts = {}

# NAUGHTY LIST
bad = {}
bad["ː"]=":"
bad["ɑ"]="A"
bad["ɪ"]="I"
bad["ɛ"]="E"
bad["ɔ"]="O"
bad["ə"]="@"
bad["ᵊ"]="@"
bad["ʊ"]="U"
bad["ʷ"]="w"
bad["˺"]=""
bad["͡"]=""
bad["̥"]=""
bad["̚"]=""
bad["ʌ"]="^"
bad["ɣ"]="G"
bad["ʔ"]="Q"
bad["ʃ"]="S"
bad["ʰ"]="!"
bad["ʂ"]="$"
bad["s̪"]="-"
bad["t̪"]="+"
bad["ɹ"]="r"
bad["ɕ"]="6"
bad["ç"]="5"
bad["θ"]="0"
bad["ɦ"]="H"
bad["ʧ"]="T"
bad["̩"]=""
revd=dict([reversed(i) for i in bad.items()]) 

allBads = bad.keys()

for e in allBads:
	phone = re.sub(e,bad[e],phone)
phLen = len(phone)

# MAIN METHOD

f = open(inFile, 'r')

lines = []

for line in f:
	lines.append(line)
f.close()



for token in lines:

	if not phone in token:
		continue
	
	token = str(token)
	token = token.strip()
	token = re.sub(r"\[|\]","",token)
	token = re.sub(r"ˈ|\'|~|(or)","",token)

	for e in allBads:
		token = re.sub(e,bad[e],token)

	places = re.finditer(phone,token)


	print "------------------"
	print token

	for match in places:

		idx = match.start()

		# LEFT
		if idx>0:
			left = token[idx-1]

			if left == ":":
				left = token[idx-2:2]
			elif left == " ":
				left = "#"
			else:
				if left == "*":
					left = "#"
		else:
			left="#"


		# RIGHT
		if idx+phLen<len(token):
			right = token[idx+phLen]

			if right == ":" or right == bad["ʰ"]:
				continue
			elif right == " ":
				right = "#"
			
			# 2 characters over
			if idx+phLen+1<len(token) and token[idx+phLen+1]==":":
				right = token[idx+phLen:idx+phLen+2]
		else:
			right="#"


		# Assembles environment entry
		envt = left + "_" + right

		if "*" in token:
			envt = "*" + envt

		# Increments the count for this envt
		if envt not in counts:
			counts[envt]=1
		else:
			counts[envt] = counts[envt] + 1

		print envt
		#print token[idx-1:3]




print "====================================="

buffer = ""
keys = counts.keys()

# Prints out a list of all envt's & counts
for key in sorted(keys):
	buffer = buffer + key + "\t" + str(counts[key]) + "\n"

#allGoods = revd.keys()
#for e in allGoods:
#	buffer = re.sub(re.escape(e),str(revd[e]),buffer)

print buffer

#print revd