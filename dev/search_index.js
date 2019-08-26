var documenterSearchIndex = {"docs":
[{"location":"#TensorNetworkAD.jl-1","page":"Home","title":"TensorNetworkAD.jl","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"This is a package with the goal to implement the algorithms described in Differentiable Programming Tensor Networks, namely implementing automatic differentiation (AD) on Corner Transfer Matrix Renormalization Group (CTMRG) and Tensor Renormalization Group (TRG), demonstrating two applications:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Gradient based optimization of iPEPS\nDirect calculation of energy densities in iPEPS via derivatives of the free energy","category":"page"},{"location":"#","page":"Home","title":"Home","text":"We aimed for readable and easy to extend code that demonstrates advantages of julia (seamless integration of different packages, performance, readability) and some cutting edge physics.","category":"page"},{"location":"userguide/#User-Guide-1","page":"User Guide","title":"User Guide","text":"","category":"section"},{"location":"userguide/#","page":"User Guide","title":"User Guide","text":"The package provides three algorithms: trg, ctmrg and variationalipeps-optimisation.","category":"page"},{"location":"userguide/#Tensor-Renormalization-Group-1","page":"User Guide","title":"Tensor Renormalization Group","text":"","category":"section"},{"location":"userguide/#","page":"User Guide","title":"User Guide","text":"The trg function can currently be used to get the partition function of a classical hamiltonian model on a square lattice. trg uses the principle of coarse graining - low-level detail is discarded in favor of dynamics that dominate the big picture. For an excellent guide to implement trg, check out this tutorial for iTensor.","category":"page"},{"location":"userguide/#","page":"User Guide","title":"User Guide","text":"The input to trg is a rank-4 tensor a that is the tensor-network representation of a model, a cutoff-dimension χ and a number of iterations niter. trg(a, χ, niter) returns the partition function per site.","category":"page"},{"location":"userguide/#","page":"User Guide","title":"User Guide","text":"The result is per site because otherwise the partition function grows exponentially (with the system size) in the number of iterations, leading to numerical problems quickly.","category":"page"},{"location":"userguide/#","page":"User Guide","title":"User Guide","text":"The trg algorithm is fully differentiable with Zygote, which enables us to directly find the first derivative of the partition function with:","category":"page"},{"location":"userguide/#","page":"User Guide","title":"User Guide","text":"julia> using Zygote, TensorNetworkAD\n\njulia> Zygote.gradient(0.5) do β\n          trg(model_tensor(Ising(), β), 5, 5)\n        end\n(1.7502426939979507,)","category":"page"},{"location":"userguide/#","page":"User Guide","title":"User Guide","text":"where we take the derivative of the ising-partition function w.r.t the inverse temperature β using the model_tensor function provided by TensorNetworkAD.","category":"page"},{"location":"userguide/#Corner-Tensor-Renormalization-Group-1","page":"User Guide","title":"Corner Tensor Renormalization Group","text":"","category":"section"},{"location":"userguide/#","page":"User Guide","title":"User Guide","text":"The ctmrg function can be used to find a representation of the environment of an ipeps. The environment can then be used to calculate local quantities for a system of infinite size such as the magnetisation or (short) correlation-lengths. For an introduction, I'd recommend  an overview paper by Roman Orus.","category":"page"},{"location":"userguide/#","page":"User Guide","title":"User Guide","text":"To use the function, first whatever tensor represents the bulk of the ipeps needs to be wrapped in a CTMRGRuntime structure which takes care of initializing the environment - either randomly or from the bulk tensor. Currently, there's only one CTMRGRuntime implemented which assumes a bulk-tensor which is invariant under any permutation of its virtual indices.","category":"page"},{"location":"userguide/#","page":"User Guide","title":"User Guide","text":"The runtime-object can then be provided to ctmrg together with a limit to the number of iterations maxit and a tolerance tol. The latter is used to decide convergence - if the sum of absolute differences in consecutive singular values of the corner is less than tol, the algorithm is converged.","category":"page"},{"location":"userguide/#","page":"User Guide","title":"User Guide","text":"A complete example to get the environment of the Ising model is","category":"page"},{"location":"userguide/#","page":"User Guide","title":"User Guide","text":"julia> a = model_tensor(Ising(),0.4);\njulia> rt = SquareCTMRGRuntime(a, Val(:random), 10);\njulia> rt = ctmrg(rt; tol=1e-6, maxit=100);\njulia> corner, edge = rt.corner, rt.edge;","category":"page"},{"location":"userguide/#","page":"User Guide","title":"User Guide","text":"where Val(:random) is used to have the environment initialized with random values.","category":"page"},{"location":"userguide/#Variational-Ipeps-Optimisation-1","page":"User Guide","title":"Variational Ipeps Optimisation","text":"","category":"section"},{"location":"userguide/#","page":"User Guide","title":"User Guide","text":"Variational Ipeps Optimisation works by combining ctmrg, automatic differentiation by Zygote and optimisation by Optim. The central function is rather simple and can be found in variationalipeps.jl.","category":"page"},{"location":"userguide/#","page":"User Guide","title":"User Guide","text":"We provide the function optimiseipeps with an IPEPS-object - a thin wrapper around a rank-5 tensor - and minimize the energy function with Optim using the gradient calculated by Zygote. Energy calculation is built on ctmrg so we need to supply its arguments: χ, tol and maxit but we might also modify the optimization algorithm using optimmethod or optimargs. optimargs can be used to e.g. print out the current energy at each step with optimargs = (show_trace = true,).","category":"page"},{"location":"userguide/#","page":"User Guide","title":"User Guide","text":"The convergence is judged by Optim and can be modified with optimargs. A complete example looks like:","category":"page"},{"location":"userguide/#","page":"User Guide","title":"User Guide","text":"julia> using Optim\njulia> h = hamiltonian(TFIsing(1.0))\njulia> ipeps = SquareIPEPS(randn(2,2,2,2,2))\njulia> ipeps = TensorNetworkAD.indexperm_symmetrize(ipeps)\njulia> res = optimiseipeps(ipeps, h; χ=5, tol=0, maxit=100,\n        optimargs = (Optim.Options(f_tol=1e-6, show_trace=true),))\njulia> e = minimum(res)","category":"page"},{"location":"userguide/#","page":"User Guide","title":"User Guide","text":"where we get the hamiltonian h of the transverse field ising model with magnetic field hx = 1, then we create a random initial ipeps with the necessary symmetry and then minimize its energy with with optimiseipeps where we consider it converged if the energy changes by less than 1e-6 between two iterations and we print the energy at each timestep. The ground-state energy is saved in e in the last line.","category":"page"},{"location":"docstrings/#","page":"Doc-Strings","title":"Doc-Strings","text":"Modules = [TensorNetworkAD]","category":"page"},{"location":"docstrings/#TensorNetworkAD.CTMRGRuntime","page":"Doc-Strings","title":"TensorNetworkAD.CTMRGRuntime","text":"CTMRGRuntime{LT}\n\na struct to hold the tensors during the ctmrg algorithm, containing\n\nD × D × D × D bulk tensor\nχ × χ corner tensor\nχ × D × χ edge tensor\n\nand LT is a AbstractLattice to define the lattice type.\n\n\n\n\n\n","category":"type"},{"location":"docstrings/#TensorNetworkAD.Heisenberg","page":"Doc-Strings","title":"TensorNetworkAD.Heisenberg","text":"Heisenberg(Jz::T,Jx::T,Jy::T) where {T<:Real}\n\nreturn a struct representing the heisenberg model with magnetisation fields Jz, Jx and Jy..\n\n\n\n\n\n","category":"type"},{"location":"docstrings/#TensorNetworkAD.IPEPS","page":"Doc-Strings","title":"TensorNetworkAD.IPEPS","text":"IPEPS{LT<:AbstractLattice, T, N}\n\nInfinite projected entangled pair of states. LT is the type of lattice, T and N are bulk tensor element type and order.\n\n\n\n\n\n","category":"type"},{"location":"docstrings/#TensorNetworkAD.SquareCTMRGRuntime-Union{Tuple{T}, Tuple{AbstractArray{T,4},Val,Int64}} where T","page":"Doc-Strings","title":"TensorNetworkAD.SquareCTMRGRuntime","text":"SquareCTMRGRuntime(bulk::AbstractArray{T,4}, env::Val, χ::Int)\n\ncreate a SquareCTMRGRuntime with bulk-tensor bulk. The corner and edge tensors are initialized according to env. If env = Val(:random), the corner is initialized as a random χ×χ tensor and the edge is initialized as a random χ×D×χ tensor where D = size(bulk,1). If env = Val(:raw), corner- and edge-tensor are initialized by summing over one or two indices of bulk respectively and embedding the result in zeros-tensors of the appropriate size, truncating if necessary.\n\nexample\n\njulia> rt = SquareCTMRGRuntime(randn(2,2,2,2), Val(:raw), 4);\n\njulia> rt.corner[1:2,1:2] ≈ dropdims(sum(rt.bulk, dims = (3,4)), dims = (3,4))\ntrue\n\njulia> rt.edge[1:2,1:2,1:2] ≈ dropdims(sum(rt.bulk, dims = 4), dims = 4)\ntrue\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#TensorNetworkAD.TFIsing","page":"Doc-Strings","title":"TensorNetworkAD.TFIsing","text":"TFIsing(hx::Real)\n\nreturn a struct representing the transverse field ising model with magnetisation hx.\n\n\n\n\n\n","category":"type"},{"location":"docstrings/#TensorNetworkAD.ctmrg-Tuple{CTMRGRuntime}","page":"Doc-Strings","title":"TensorNetworkAD.ctmrg","text":"ctmrg(rt::CTMRGRuntime; tol, maxit)\n\nreturn a CTMRGRuntime with an environment consisting of corner and edge tensor that have either been iterated for maxit iterations or converged according to tol. Convergence is tested by looking at the sum of the absolut differences in the corner singular values. If it is less than tol, convergence is reached.\n\nexample\n\njulia> a = model_tensor(Ising(),β);\n\njulia> rt = SquareCTMRGRuntime(a, Val(:random), χ);\n\njulia> env = ctmrg(rt; tol=1e-6, maxit=100);\n\nfor the environment of an isingmodel at inverse temperature β on an infinite square lattice.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#TensorNetworkAD.hamiltonian","page":"Doc-Strings","title":"TensorNetworkAD.hamiltonian","text":"hamiltonian(model<:HamiltonianModel)\n\nreturn the hamiltonian of the model as a two-site tensor operator.\n\n\n\n\n\n","category":"function"},{"location":"docstrings/#TensorNetworkAD.hamiltonian-Tuple{Heisenberg}","page":"Doc-Strings","title":"TensorNetworkAD.hamiltonian","text":"hamiltonian(model::Heisenberg)\n\nreturn the heisenberg hamiltonian for the model as a two-site operator.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#TensorNetworkAD.hamiltonian-Tuple{TFIsing}","page":"Doc-Strings","title":"TensorNetworkAD.hamiltonian","text":"hamiltonian(model::TFIsing)\n\nreturn the transverse field ising hamiltonian for the provided model as a two-site operator.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#TensorNetworkAD.mag_tensor-Tuple{Ising,Any}","page":"Doc-Strings","title":"TensorNetworkAD.mag_tensor","text":"mag_tensor(::Ising,β)\n\nreturn the operator for the magnetisation at inverse temperature β at a site in the two-dimensional ising model on a square lattice in tensor-network form.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#TensorNetworkAD.model_tensor-Tuple{Ising,Real}","page":"Doc-Strings","title":"TensorNetworkAD.model_tensor","text":"model_tensor(::Ising,β)\n\nreturn the isingtensor at inverse temperature β for a two-dimensional square lattice tensor-network.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#TensorNetworkAD.num_grad-Tuple{Any,AbstractArray}","page":"Doc-Strings","title":"TensorNetworkAD.num_grad","text":"num_grad(f, K::AbstractArray; [δ = 1e-5])\n\nreturn the numerical gradient of f for each element of K.\n\nexample\n\njulia> TensorNetworkAD.num_grad(tr, rand(2,2)) ≈ I\ntrue\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#TensorNetworkAD.num_grad-Tuple{Any,Real}","page":"Doc-Strings","title":"TensorNetworkAD.num_grad","text":"num_grad(f, K::Real; [δ = 1e-5])\n\nreturn the numerical gradient of f at K calculated with (f(K+δ/2) - f(K-δ/2))/δ\n\nexample\n\njulia> TensorNetworkAD.num_grad(x -> x * x, 3) ≈ 6\ntrue\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#TensorNetworkAD.optimiseipeps-Union{Tuple{LT}, Tuple{IPEPS{LT,T,N,AT} where AT<:AbstractArray{T,N} where N where T,Any}} where LT","page":"Doc-Strings","title":"TensorNetworkAD.optimiseipeps","text":"optimiseipeps(ipeps, h; χ, tol, maxit, optimargs = (), optimmethod = LBFGS(m = 20))\n\nreturn the tensor bulk' that describes an ipeps that minimises the energy of the two-site hamiltonian h. The minimization is done using Optim with default-method LBFGS. Alternative methods can be specified by loading LineSearches and providing optimmethod. Other options to optim can be passed with optimargs. The energy is calculated using ctmrg with parameters χ, tol and maxit.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#TensorNetworkAD.trg-Union{Tuple{T}, Tuple{AbstractArray{T,4},Any,Any}} where T","page":"Doc-Strings","title":"TensorNetworkAD.trg","text":"trg(a, χ, niter)\n\nreturn the partition-function of a two-dimensional system of size 2^niter described by the tensor a calculated via the tensor renormalization group algorithm. a is a rank-4 tensor with the following indices:\n\n    |1\n4--[a]--2\n   3|\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#TensorNetworkAD.StopFunction-Tuple{Any}","page":"Doc-Strings","title":"TensorNetworkAD.StopFunction","text":"(st::StopFunction)(state)\n\nstopfunction for ctmrg, returning true if singular values are converged or the maximum number of iterations is reached. Implemented as a closure since it needs to remember the last singular values it saw for comparison.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#TensorNetworkAD.ctmrgstep-Tuple{CTMRGRuntime{SquareLattice,T,4,AT,CT,ET} where ET where CT where AT where T,Any}","page":"Doc-Strings","title":"TensorNetworkAD.ctmrgstep","text":"ctmrgstep(rt,vals)\n\nevaluate one step of the ctmrg-algorithm, returning a tuple of an updated CTMRGRuntime with updated corner and edge tensor and a vector of singular values to test convergence with.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#TensorNetworkAD.diaglocalhamiltonian-Tuple{Array{T,1} where T}","page":"Doc-Strings","title":"TensorNetworkAD.diaglocalhamiltonian","text":"diaglocalhamiltonian(diag::Vector)\n\nreturn the 2-site Hamiltonian with single-body terms given by the diagonal diag.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#TensorNetworkAD.energy-Union{Tuple{T}, Tuple{AbstractArray{T,4},IPEPS}} where T","page":"Doc-Strings","title":"TensorNetworkAD.energy","text":"energy(h, ipeps; χ, tol, maxit)\n\nreturn the energy of the ipeps 2-site hamiltonian h and calculated via a ctmrg with parameters χ, tol and maxit.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#TensorNetworkAD.expectationvalue-Union{Tuple{T}, Tuple{Any,Any,CTMRGRuntime{SquareLattice,T,4,AT,CT,ET} where ET where CT where AT where T}} where T","page":"Doc-Strings","title":"TensorNetworkAD.expectationvalue","text":"expectationvalue(h, ap, rt)\n\nreturn the expectationvalue of a two-site operator h with the sites described by rank-6 tensor ap each and an environment described by a SquareCTMRGRuntime rt.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#TensorNetworkAD.fixedpoint-Tuple{Any,Any,Any}","page":"Doc-Strings","title":"TensorNetworkAD.fixedpoint","text":"fixedpoint(f, guess, stopfun)\n\nreturn the result of applying guess = f(guess) until convergence. Convergence is decided by applying stopfun(guess) which returns a Boolean.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#TensorNetworkAD.indexperm_symmetrize-Tuple{IPEPS{SquareLattice,T,5,AT} where AT<:AbstractArray{T,5} where T}","page":"Doc-Strings","title":"TensorNetworkAD.indexperm_symmetrize","text":"indexperm_symmetrize(ipeps::SquareIPEPS)\n\nreturn a SquareIPEPS based on ipeps that is symmetric under permutation of its virtual indices.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#TensorNetworkAD.magnetisation-Union{Tuple{MT}, Tuple{MT,Any,Any}} where MT<:TensorNetworkAD.HamiltonianModel","page":"Doc-Strings","title":"TensorNetworkAD.magnetisation","text":"magnetisation(model<:HamiltonianModel, β, χ)\n\nreturn the magnetisation of the model as a function of the inverse temperature β and the environment bonddimension χ as calculated with ctmrg. Requires that mag_tensor and model_tensor are defined for model.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#TensorNetworkAD.magofβ-Tuple{Ising,Any}","page":"Doc-Strings","title":"TensorNetworkAD.magofβ","text":"magofβ(::Ising,β)\n\nreturn the analytical result for the magnetisation at inverse temperature β for the 2d classical ising model.\n\n\n\n\n\n","category":"method"},{"location":"docstrings/#TensorNetworkAD.tensorfromclassical-Tuple{Array{T,2} where T}","page":"Doc-Strings","title":"TensorNetworkAD.tensorfromclassical","text":"tensorfromclassical(h::Matrix)\n\ngiven a classical 2-body hamiltonian h, return the corresponding tensor for use in e.g. trg for a two-dimensional square-lattice.\n\nExample\n\njulia> model_tensor(Ising(),β) ≈ tensorfromclassical([β -β; -β β])\n\ntrue\n\n\n\n\n\n","category":"method"},{"location":"future/#Future-Directions-1","page":"Future Directions","title":"Future Directions","text":"","category":"section"},{"location":"future/#","page":"Future Directions","title":"Future Directions","text":"To improve upon the package, there are two main places for improvement - trg and ctmrg. An area that impacts both is the ability to run on the GPU. While a lot of the components are GPU-compatible, there are currently problems with Zygote. The add-gpu branch is a work in progress on compatibility but is hold back by a problem with Zygote at the moment.","category":"page"},{"location":"future/#TRG-1","page":"Future Directions","title":"TRG","text":"","category":"section"},{"location":"future/#","page":"Future Directions","title":"Future Directions","text":"For trg, we should support different lattice-geometries, e.g. triangular or hexagonal. This would require dispatching trg on an AbstractLattice type and implementing the necessary coarse-graining functions.","category":"page"},{"location":"future/#","page":"Future Directions","title":"Future Directions","text":"Keeping it AD-compatible should be easy since the building blocks remain the same for different geometries.","category":"page"},{"location":"future/#","page":"Future Directions","title":"Future Directions","text":"If Zygote allows, getting the second derivative would allow to the direct calculation of the specific heat.","category":"page"},{"location":"future/#CTMRG-1","page":"Future Directions","title":"CTMRG","text":"","category":"section"},{"location":"future/#","page":"Future Directions","title":"Future Directions","text":"ctmrg currently only works for tensors that are invariant under permutation of its indices. Adding an implementation that does not assume symmetries would be a big improvement. This could be combined with the ability to specify a unit-cell for the problem. First attempts are in the unitcell-branch where most of the groundwork is laid but it does not work yet and its interface needs to be updated to the current interface.  It is based on this paper. Again, AD-compatibility should be easy to maintain, given that the code generally uses the same functions.","category":"page"}]
}
