class Fila:
    def __init__(self):
        self.itens = []

    def enfileirar(self, item):
        self.itens.append(item)

    def desenfileirar(self):
        if self.itens:
            return self.itens.pop(0)
        return None

    def vazia(self):
        return len(self.itens) == 0

    def __repr__(self):
        return f"Fila({self.itens})"
    
