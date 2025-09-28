#create a list and print it in reverse order using for loop
myList = []
for i in range(5):
    num = int(input("Enter Number " + str(i + 1) + ": "))
    myList.append(num)

for i in range(len(myList) - 1, -1, -1):
    print(myList[i])
