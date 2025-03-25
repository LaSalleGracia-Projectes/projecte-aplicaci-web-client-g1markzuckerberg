'use client';

import Layout from "@/components/layout";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Typography,
} from "@/components/ui";
import AuthGuard from "@/components/authGuard/authGuard";

export default function Cuenta() {
  return (
    <AuthGuard>
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
            {/* Información */}
            <Card>
              <CardHeader className="bg-black text-white p-4 rounded-t-lg">
                <Typography variant="h6" className="text-white">Información</Typography>
              </CardHeader>
              <CardBody className="space-y-4 bg-white p-6 rounded-b-lg">
                <div>
                  <label className="text-sm font-medium">Nombre</label>
                  <Input type="text" placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="text-sm font-medium">Fecha de nacimiento</label>
                  <Input type="date" />
                </div>
                <div className="pt-6">
                  <Typography variant="h6">Eliminación de cuenta</Typography>
                  <p className="text-sm text-gray-500">
                    Si deseas deshabilitar tu cuenta, ten en cuenta que esta acción es irreversible y perderás acceso a todos
                    tus datos y servicios asociados.
                  </p>
                  <Button color="red" className="w-full mt-3">ELIMINAR CUENTA</Button>
                </div>
              </CardBody>
            </Card>
            
            {/* Acceso */}
            <Card>
              <CardHeader className="bg-black text-white p-4 rounded-t-lg">
                <Typography variant="h6" className="text-white">Acceso</Typography>
              </CardHeader>
              <CardBody className="space-y-4 bg-white p-6 rounded-b-lg">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="ejemplo@email.com" />
                </div>
                <div>
                  <label className="text-sm font-medium">Nuevo contraseña</label>
                  <Input type="password" />
                </div>
                <div>
                  <label className="text-sm font-medium">Confirmar contraseña</label>
                  <Input type="password" />
                </div>
                <div>
                  <label className="text-sm font-medium">Prefijo del teléfono</label>
                  <Input type="text" placeholder="+34" />
                </div>
                <div>
                  <label className="text-sm font-medium">Número de teléfono</label>
                  <Input type="tel" placeholder="123456789" />
                </div>
              </CardBody>
              <CardFooter className="bg-white p-6 rounded-b-lg">
                <Button className="w-full">GUARDAR CAMBIOS</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  );
}
