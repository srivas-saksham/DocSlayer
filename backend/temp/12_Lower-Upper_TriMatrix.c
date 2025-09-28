// Read and Display Upper, Lower and Tri-diagonal Triangle.
#include <stdio.h>
#include <stdlib.h>  // Required for malloc()

// Function to input a dynamically allocated matrix
void inputMatrix(int SIZE, int **matrix) {
    printf("Enter elements of the matrix (%dx%d):\n", SIZE, SIZE);
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            printf("matrix[%d][%d]: ", i, j);
            scanf("%d", &matrix[i][j]);
        }
    }
}

// Function to print a dynamically allocated matrix
void printMatrix(int SIZE, int **matrix) {
    printf("\nMatrix is:\n");
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            printf("%4d ", matrix[i][j]);
        }
        printf("\n");
    }
}

// Function to print lower triangle matrix
void lowerTri(int SIZE, int **matrix){
    printf("\nLower Triangular Matrix:\n");
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            if (i>=j){
                printf("%4d ", matrix[i][j]);
            }
        }
        printf("\n");
    }
}

// Function to print upper triangle matrix
void upperTri(int SIZE, int **matrix){
    printf("\nUpper Triangular Matrix:\n");
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            if (i<=j){
                printf("%4d ", matrix[i][j]);
            }
            else{
                printf("     ");
            }
        }
        printf("\n");
    }
}

// Function to print tri diagonal matrix
void triDiagonal(int SIZE, int **matrix){
    printf("\nTri Diagonal Matrix:\n");
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            if (i==j || i-1 == j || i+1 == j){
                printf("%4d ", matrix[i][j]);
            }
            else{
                printf("     ");
            }
        }
        printf("\n");
    }
}


// Main Function
int main() {
    int SIZE;
    
    printf("Enter Dimension of Square Matrix: ");
    scanf("%d", &SIZE);

    // Dynamically allocate 2D array
    int **matrix = (int **)malloc(SIZE * sizeof(int *));
    for (int i = 0; i < SIZE; i++) {
        matrix[i] = (int *)malloc(SIZE * sizeof(int));
    }

    inputMatrix(SIZE, matrix);
    printMatrix(SIZE, matrix);
    lowerTri(SIZE, matrix);
    upperTri(SIZE, matrix);
    triDiagonal(SIZE, matrix);

    // Free allocated memory
    for (int i = 0; i < SIZE; i++) {
        free(matrix[i]);
    }
    free(matrix);

    return 0;
}
