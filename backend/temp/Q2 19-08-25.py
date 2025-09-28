#Assign grade to students such as- marks >=90 A+ | >=75 A | >=60 B | >=50 C | else F
marks = int(input("Enter the marks obtained by the student: "))

if marks >= 90:
    grade = "A+"
elif marks >= 75:
    grade = "A"
elif marks >= 60:
    grade = "B"
elif marks >= 50:
    grade = "C"
else:
    grade = "F"

print("The grade is:", grade)
