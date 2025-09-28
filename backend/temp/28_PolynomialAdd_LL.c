// WAP to perform Polynomial Addition using Linked List

#include <stdio.h>
#include <stdlib.h>

// Structure for a polynomial term
struct Node {
    int coeff;  // Coefficient
    int exp;    // Exponent
    struct Node* next;
};

// Function to create a new term
struct Node* createNode(int coeff, int exp) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->coeff = coeff;
    newNode->exp = exp;
    newNode->next = NULL;
    return newNode;
}

// Function to insert a term in sorted order (descending exponent)
void insertTerm(struct Node** poly, int coeff, int exp) {
    struct Node* newNode = createNode(coeff, exp);
    if (*poly == NULL || (*poly)->exp < exp) {
        newNode->next = *poly;
        *poly = newNode;
    } else {
        struct Node* temp = *poly;
        while (temp->next != NULL && temp->next->exp > exp) {
            temp = temp->next;
        }
        newNode->next = temp->next;
        temp->next = newNode;
    }
}

// Function to display a polynomial
void displayPolynomial(struct Node* poly) {
    if (poly == NULL) {
        printf("0\n");
        return;
    }
    
    while (poly != NULL) {
        printf("%dx^%d", poly->coeff, poly->exp);
        if (poly->next != NULL)
            printf(" + ");
        poly = poly->next;
    }
    printf("\n");
}

// Function to add two polynomials
struct Node* addPolynomials(struct Node* poly1, struct Node* poly2) {
    struct Node* sumPoly = NULL;
    
    while (poly1 != NULL || poly2 != NULL) {
        int coeff, exp;

        if (poly1 != NULL && (poly2 == NULL || poly1->exp > poly2->exp)) {
            coeff = poly1->coeff;
            exp = poly1->exp;
            poly1 = poly1->next;
        } else if (poly2 != NULL && (poly1 == NULL || poly2->exp > poly1->exp)) {
            coeff = poly2->coeff;
            exp = poly2->exp;
            poly2 = poly2->next;
        } else {  // If exponents are the same, add coefficients
            coeff = poly1->coeff + poly2->coeff;
            exp = poly1->exp;
            poly1 = poly1->next;
            poly2 = poly2->next;
        }

        // Insert only if the coefficient is non-zero
        if (coeff != 0) {
            insertTerm(&sumPoly, coeff, exp);
        }
    }

    return sumPoly;
}

// Main function
int main() {
    struct Node *poly1 = NULL, *poly2 = NULL, *sumPoly = NULL;
    int n1, n2, coeff, exp;

    // Input for first polynomial
    printf("Enter the number of terms in the first polynomial: ");
    scanf("%d", &n1);
    printf("Enter terms (coefficient exponent):\n");
    for (int i = 0; i < n1; i++) {
        scanf("%d %d", &coeff, &exp);
        insertTerm(&poly1, coeff, exp);
    }

    // Input for second polynomial
    printf("Enter the number of terms in the second polynomial: ");
    scanf("%d", &n2);
    printf("Enter terms (coefficient exponent):\n");
    for (int i = 0; i < n2; i++) {
        scanf("%d %d", &coeff, &exp);
        insertTerm(&poly2, coeff, exp);
    }

    // Display the polynomials
    printf("\nFirst Polynomial: ");
    displayPolynomial(poly1);

    printf("Second Polynomial: ");
    displayPolynomial(poly2);

    // Add polynomials
    sumPoly = addPolynomials(poly1, poly2);

    // Display result
    printf("Sum of Polynomials: ");
    displayPolynomial(sumPoly);

    return 0;
}
